
import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    itemName: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "INR",
    },

    purpose: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      default: "general",
    },

    sourceMessage: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "submitted",
        "needs_info",
        "po_created",
        "sourcing_started",
        "needs_approval",
        "approved",
        "rejected",
      ],
      default: "submitted",
    },

    rejectionReason: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("PurchaseRequest", schema);
