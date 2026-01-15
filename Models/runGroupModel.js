const mongoose = require("mongoose");

const runGroupSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      unique: true, // ONE run group per event
    },
    rawText: {
      type: String,
      required: true,
    },
    normalized: {
      type: String,
      required: true,
      enum: ["RED", "BLUE", "A", "1"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RunGroup", runGroupSchema);