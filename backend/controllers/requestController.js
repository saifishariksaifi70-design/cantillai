import mongoose from 'mongoose'
import PurchaseRequest from "../models/purchaseRequest.js";
import Decision from "../models/decision.js";
import PurchaseOrder from "../models/purchaseOrder.js";
import SourcingRequest from "../models/sourcingRequest.js";


// 1. Get logged-in employee's requests
export async function myRequests(req, res) {
  try {
    const requests = await PurchaseRequest.find({
      employee: req.user.id
    }).sort({ createdAt: -1 });

    return res.json({ requests });

  } catch (error) {
    console.error("My Requests Error:", error.message);

    return res.status(500).json({
      message: "Could not fetch your requests."
    });
  }
}

// 2. Get all purchase requests (Admin)
export async function allRequests(req, res) {
  try {
    const requests = await PurchaseRequest.find()
      .populate("employee", "name email")
      .sort({ createdAt: -1 });

    return res.json({ requests });

  } catch (error) {
    console.error("All Requests Error:", error.message);

    return res.status(500).json({
      message: "Could not fetch all requests."
    });
  }
}

// 3. Get dashboard statistics (Admin)
export async function dashboard(req, res) {
  try {
    const [total, orders, sourcing, pending] = await Promise.all([
      PurchaseRequest.countDocuments(),

      PurchaseOrder.countDocuments(),

      SourcingRequest.countDocuments(),

      PurchaseRequest.countDocuments({
        status: "needs_approval"
      })
    ]);

    return res.json({
      total,
      orders,
      sourcing,
      pending
    });

  } catch (error) {
    console.error("Dashboard Error:", error.message);

    return res.status(500).json({
      message: "Could not fetch dashboard statistics."
    });
  }
}

// 4. Get all purchase orders (Admin)
export async function listOrders(req, res) {
  try {
    const orders = await PurchaseOrder.find()
      .populate("request")
      .sort({ createdAt: -1 });

    return res.json({ orders });

  } catch (error) {
    console.error("List Orders Error:", error.message);

    return res.status(500).json({
      message: "Could not fetch purchase orders."
    });
  }
}

// 5. Get all sourcing requests (Admin)
export async function listSourcing(req, res) {
  try {
    const items = await SourcingRequest.find()
      .populate("request")
      .sort({ createdAt: -1 });

    return res.json({
      sourcing: items
    });

  } catch (error) {
    console.error("List Sourcing Error:", error.message);

    return res.status(500).json({
      message: "Could not fetch sourcing requests."
    });
  }
}

// 6. Get all procurement decisions (Admin)
export async function listDecisions(req, res) {
  try {
    const decisions = await Decision.find()
      .populate("request")
      .populate("policy", "version title")
      .sort({ createdAt: -1 });

    return res.json({ decisions });

  } catch (error) {
    console.error("List Decisions Error:", error.message);

    return res.status(500).json({
      message: "Could not fetch decisions."
    });
  }
}

// 7. Admin: Approve purchase request
export async function approveRequest(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid request ID.",
      });
    }

    const request = await PurchaseRequest.findById(id);

    if (!request) {
      return res.status(404).json({
        message: "Purchase request not found.",
      });
    }

    if (request.status !== "needs_approval") {
      return res.status(400).json({
        message: "Request is not waiting for approval.",
      });
    }

    const decision = await Decision.findOne({
      request: request._id,
      outcome: "needs_approval",
    }).sort({ createdAt: -1 });

    if (!decision || decision.approvalStatus !== "pending") {
      return res.status(400).json({
        message: "Pending approval decision not found.",
      });
    }

    const existingPO = await PurchaseOrder.findOne({
      request: request._id,
    });

    if (existingPO) {
      return res.status(409).json({
        message: "Purchase Order already exists.",
      });
    }

    const purchaseOrder = await PurchaseOrder.create({
      request: request._id,
      poNumber: `PO-${Date.now()}`,
      totalAmount: request.quantity * request.unitPrice,
      status: "approved",
    });

    request.status = "approved";
    await request.save();

    decision.approvalStatus = "approved";
    decision.reviewedBy = req.user.id;
    decision.reviewedAt = new Date();
    await decision.save();

    return res.json({
      message: "Purchase request approved successfully.",
      request,
      decision,
      purchaseOrder,
    });

  } catch (error) {
    console.error("Approve Request Error:", error);

    return res.status(500).json({
      message: "Could not approve purchase request.",
    });
  }
}


// 8. Admin: Reject purchase request
export async function rejectRequest(req, res) {
  try {
    const { id } = req.params;
    const { reason } = req.body || {};

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid request ID.",
      });
    }

    if (typeof reason !== "string" || !reason.trim()) {
      return res.status(400).json({
        message: "Rejection reason is required.",
      });
    }

    const request = await PurchaseRequest.findById(id);

    if (!request) {
      return res.status(404).json({
        message: "Purchase request not found.",
      });
    }

    if (request.status !== "needs_approval") {
      return res.status(400).json({
        message: "Request is not waiting for approval.",
      });
    }

    const decision = await Decision.findOne({
      request: request._id,
      outcome: "needs_approval",
    }).sort({ createdAt: -1 });

    if (!decision || decision.approvalStatus !== "pending") {
      return res.status(400).json({
        message: "Pending approval decision not found.",
      });
    }

    request.status = "rejected";
    request.rejectionReason = reason.trim();
    await request.save();

    decision.approvalStatus = "rejected";
    decision.reviewedBy = req.user.id;
    decision.reviewedAt = new Date();
    decision.adminReason = reason.trim();
    await decision.save();

    return res.json({
      message: "Purchase request rejected successfully.",
      request,
      decision,
    });

  } catch (error) {
    console.error("Reject Request Error:", error);

    return res.status(500).json({
      message: "Could not reject purchase request.",
    });
  }
}


export async function myOrders(req, res) {
  try {
    const requests = await PurchaseRequest.find({
      employee: req.user.id
    }).select("_id");

    const orders = await PurchaseOrder.find({
      request: { $in: requests.map((item) => item._id) }
    })
      .populate("request")
      .sort({ createdAt: -1 });

    return res.json({ orders });
  } catch (error) {
    console.error("My Orders Error:", error.message);
    return res.status(500).json({
      message: "Could not fetch your orders."
    });
  }
}
