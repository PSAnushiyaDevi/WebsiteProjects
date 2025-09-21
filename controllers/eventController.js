const Event = require("../models/Event");

// Create new event
const createEvent = async (req, res) => {
  try {
    const { eventName, totalAmount, payer, members } = req.body;

    const share = totalAmount / members.length;

    const formattedMembers = members.map(m => ({
      name: m.name,
      email: m.email,
      amount: share,
      paid: m.name === payer // payer already paid
    }));

    const event = new Event({
      eventName,
      totalAmount,
      payer,
      members: formattedMembers
    });

    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all events
const getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update member payment status
const updatePayment = async (req, res) => {
  try {
    const { eventId, memberEmail } = req.body;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const member = event.members.find(m => m.email === memberEmail);
    if (!member) return res.status(404).json({ message: "Member not found" });

    member.paid = true;
    await event.save();

    res.json({ message: "Payment updated", event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete event
const deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createEvent, getEvents, updatePayment, deleteEvent };
