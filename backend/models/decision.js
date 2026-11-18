
import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PurchaseRequest",
      required: true,
    },

    policy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Policy",
      required: true,
    },

    policyVersion: {
      type: Number,
      required: true,
    },

    outcome: {
      type: String,
      enum: [
        "purchase_order",
        "sourcing_request",
        "needs_approval",
        "rejected",
      ],
      required: true,
    },

    reasons: {
      type: [String],
      default: [],
    },

    // Admin review details
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },

    adminReason: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Decision", schema);
