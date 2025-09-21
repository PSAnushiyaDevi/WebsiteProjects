const express = require("express");
const router = express.Router();
const { createEvent, getEvents, updatePayment, deleteEvent } = require("../controllers/eventController");

router.post("/", createEvent);         // Create Event
router.get("/", getEvents);            // View all Events
router.put("/update", updatePayment);  // Update Payment
router.delete("/:id", deleteEvent);    // Delete Event

module.exports = router;
