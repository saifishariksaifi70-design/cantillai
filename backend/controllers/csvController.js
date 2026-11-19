
import fs from "fs";

import { parseCSV, validateCSV } from "../services/csvService.js";
import { evaluateRequest } from "../services/policyEngine.js";

import Policy from "../models/Policy.js";
import PurchaseRequest from "../models/purchaseRequest.js";
import Decision from "../models/decision.js";
import PurchaseOrder from "../models/purchaseOrder.js";
import SourcingRequest from "../models/sourcingRequest.js";

export async function uploadCSV(req, res) {
  let filePath;

  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a CSV file."
      });
    }

    filePath = req.file.path;

    // Parse CSV
    const rows = await parseCSV(filePath);
    console.log("CSV Parsed Rows:", rows);
console.log("CSV Headers:", Object.keys(rows[0] || {}));

    // Validate CSV
    const validation = validateCSV(rows);
    console.log("Validation Result:", validation);

    if (!validation.isValid) {
      return res.status(400).json({
        message: "CSV validation failed.",
        errors: validation.errors
      });
    }

    // Get active policy
    const policy = await Policy.findOne({
      status: "active"
    }).sort({ version: -1 });

    if (!policy) {
      return res.status(409).json({
        message: "No active procurement policy found."
      });
    }

    const results = [];

    for (const row of rows) {
      const requestData = {
        itemName: row.itemName.trim(),
        quantity: Number(row.quantity),
        unitPrice: Number(row.unitPrice),
        category: row.category.trim(),
        currency: row.currency?.trim() || "INR",
        purpose: row.purpose?.trim() || ""
      };

      // Save purchase request
      const request = await PurchaseRequest.create({
        employee: req.user.id,
        ...requestData,
        sourceMessage: "CSV Upload",
        status: "submitted"
      });

      // Evaluate procurement policy
      const result = evaluateRequest(requestData, policy);

      if (result.outcome === "needs_info") {
        request.status = "needs_info";
      }

      // Save decision
      const decision = await Decision.create({
        request: request._id,
        policy: policy._id,
        policyVersion: policy.version,
        outcome: result.outcome,
        reasons: result.reasons
      });

      // Create Purchase Order
      if (result.outcome === "purchase_order") {
        await PurchaseOrder.create({
          request: request._id,
          poNumber: `PO-${Date.now()}-${results.length}`,
          totalAmount: requestData.quantity * requestData.unitPrice,
          status: "approved"
        });

        request.status = "po_created";
      }

      // Create Sourcing Request
      else if (result.outcome === "sourcing_request") {
        await SourcingRequest.create({
          request: request._id,
          sourcingNumber: `SRC-${Date.now()}-${results.length}`,
          reason: result.reasons.join(" "),
          status: "open"
        });

        request.status = "sourcing_started";
      }

      // Approval or rejection
      else if (
        result.outcome === "needs_approval" ||
        result.outcome === "rejected"
      ) {
        request.status = result.outcome;
      }

      await request.save();

      results.push({
        requestId: request._id,
        itemName: request.itemName,
        outcome: result.outcome,
        reasons: result.reasons
      });
    }

    return res.status(201).json({
      message: "CSV processed successfully.",
      totalRows: rows.length,
      processed: results.length,
      results
    });

  } catch (error) {
    console.error("CSV Upload Error:", error);

    return res.status(500).json({
      message: "CSV processing failed."
    });

  } finally {
    if (filePath) {
      fs.promises.unlink(filePath).catch(() => {});
    }
  }
}
