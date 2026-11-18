
import mongoose from "mongoose";

const schema = new mongoose.Schema({
  version: {
    type: Number,
    required: true,
    unique: true
  },

  title: {
    type: String,
    required: true
  },

  rules: {
    type: {
      autoPOUnder: {
        type: Number,
        required: true,
        min: 0
      },
      sourcingAtOrAbove: {
        type: Number,
        required: true,
        min: 0
      },
      approvalRequiredAbove: {
        type: Number,
        required: true,
        min: 0
      },
      restrictedCategories: {
        type: [String],
        default: []
      }
    },
    required: true
  },

  status: {
    type: String,
    enum: ["draft", "active", "archived"],
    default: "draft"
  },

  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

export default mongoose.model("Policy", schema);
