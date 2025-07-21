// models/Chat.js
import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    response: { type: String }, // not required to avoid save errors on API failure
  },
  { timestamps: true }
);

export default mongoose.model("Chat", chatSchema);
