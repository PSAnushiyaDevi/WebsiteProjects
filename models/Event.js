const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  amount: { type: Number, required: true },
  paid: { type: Boolean, default: false }
});

const eventSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  payer: { type: String, required: true },
  members: [memberSchema],
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);
