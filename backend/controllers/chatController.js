import { z } from "zod";

import { extractPurchaseDetails } from "../services/aiService.js";
import { evaluateRequest } from "../services/policyEngine.js";

import Policy from "../models/Policy.js";
import PurchaseRequest from "../models/purchaseRequest.js";
import Decision from "../models/decision.js";
import PurchaseOrder from "../models/purchaseOrder.js";
import SourcingRequest from "../models/sourcingRequest.js";

// Validate AI extracted data
const requestSchema = z.object({
  itemName: z.string().trim().min(1).nullable().optional(),
  quantity: z.number().positive().nullable().optional(),
  unitPrice: z.number().nonnegative().nullable().optional(),
  currency: z.string().nullable().optional(),
  purpose: z.string().nullable().optional(),
  category: z.string().nullable().optional()
});

// Send employee message
export async function sendMessage(req, res) {
  try {
    // 1. Get employee message
    const message = String(req.body?.message || "").trim();

    if (!message || message.length > 2000) {
      return res.status(400).json({
        message: "Message must be 1-2000 characters."
      });
    }

    // 2. Extract purchase details using Gemini AI
    const extracted = await extractPurchaseDetails(message);

    // 3. Validate AI response using Zod
    const parsed = requestSchema.safeParse(extracted);

    if (!parsed.success) {
      return res.status(422).json({
        message: "AI returned invalid request details. Please rephrase."
      });
    }

    const d = parsed.data;

    // 4. Check missing required fields
    const missing = ["itemName", "quantity", "unitPrice"].filter(
      (key) =>
        d[key] == null ||
        (typeof d[key] === "string" && !d[key].trim())
    );

    // 5. If details are missing, save request as needs_info
    if (missing.length > 0) {
      const request = await PurchaseRequest.create({
        employee: req.user.id,
        itemName: d.itemName || "Details pending",
        quantity: d.quantity ?? 1,
        unitPrice: d.unitPrice ?? 0,
        currency: d.currency || "INR",
        purpose: d.purpose || "",
        category: d.category || "general",
        sourceMessage: message,
        status: "needs_info"
      });

      return res.status(201).json({
        request,
        status: "needs_info",
        missingFields: missing,
        message: `Please provide: ${missing.join(", ")}`
      });
    }

    // 6. Get active procurement policy
    const policy = await Policy.findOne({
      status: "active"
    }).sort({ version: -1 });

    if (!policy) {
      return res.status(409).json({
        message: "No active procurement policy."
      });
    }

    // 7. Create purchase request
    const request = await PurchaseRequest.create({
      employee: req.user.id,
      itemName: d.itemName,
      quantity: d.quantity,
      unitPrice: d.unitPrice,
      currency: d.currency || "INR",
      purpose: d.purpose || "",
      category: d.category || "general",
      sourceMessage: message,
      status: "submitted"
    });

    // 8. Evaluate request using Policy Engine
    const result = evaluateRequest(d, policy);

    // 9. Handle needs_info outcome
    if (result.outcome === "needs_info") {
      request.status = "needs_info";
      await request.save();

      return res.status(201).json({
        request,
        ...result
      });
    }

    // 10. Save decision history
    const decision = await Decision.create({
      request: request._id,
      policy: policy._id,
      policyVersion: policy.version,
      outcome: result.outcome,
      reasons: result.reasons
    });

    // 11. Create Purchase Order
    if (result.outcome === "purchase_order") {
      await PurchaseOrder.create({
        request: request._id,
        poNumber: `PO-${Date.now()}`,
        totalAmount: d.quantity * d.unitPrice,
        status: "approved"
      });

      request.status = "po_created";
    }

    // 12. Create Sourcing Request
    else if (result.outcome === "sourcing_request") {
      await SourcingRequest.create({
        request: request._id,
        sourcingNumber: `SRC-${Date.now()}`,
        reason: result.reasons.join(" "),
        status: "open"
      });

      request.status = "sourcing_started";
    }

    // 13. Handle approval or rejection
    else {
      request.status = result.outcome;
    }

    // 14. Save updated request status
    await request.save();

    // 15. Send final response
    return res.status(201).json({
      message: "Purchase request processed successfully.",
      request,
      decision
    });

  } catch (error) {
    console.error("Chat processing error:", error);

    return res.status(500).json({
      message: "Could not process request. Please retry."
    });
  }
}
