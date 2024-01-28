import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
  },
  { timestamps: true }
);

// Create a Message model using the schema
const Message = mongoose.model("Message", messageSchema);

export default Message;
