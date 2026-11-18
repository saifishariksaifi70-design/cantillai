
import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PurchaseRequest",
      required: true,
      unique: true,
    },

    poNumber: {
      type: String,
      required: true,
      unique: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["draft", "pending_approval", "approved"],
      default: "pending_approval",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("PurchaseOrder", schema);
