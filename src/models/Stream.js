const mongoose = require("mongoose");

const streamSchema = new mongoose.Schema(
  {
    streamerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    streamId: { type: String, required: true, unique: true },
    viewers: { type: Number, default: 0 },
    isLive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Stream", streamSchema);
