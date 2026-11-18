
import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PurchaseRequest",
      required: true,
      unique: true,
    },

    sourcingNumber: {
      type: String,
      required: true,
      unique: true,
    },

    reason: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["open", "in_progress", "completed"],
      default: "open",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("SourcingRequest", schema);
