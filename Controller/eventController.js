const Event = require("../Models/eventModel");
const User = require("../Models/usersModel");

// ================= CREATE EVENT (OWNER) =================
exports.createEvent = async (req, res) => {
  try {
    const { name, track, startDate, endDate } = req.body;

    if (!name || !track || !startDate || !endDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const event = await Event.create({
      name,
      track,
      startDate,
      endDate,
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating event",
      error: error.message,
    });
  }
};


// ================= GET ALL EVENTS =================
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ startDate: -1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching events",
      error: error.message,
    });
  }
};

// ================= SELECT ACTIVE EVENT (per user/session) =================
exports.selectActiveEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Update user's activeEvent field
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.activeEvent = eventId;
    await user.save();

    res.status(200).json({ message: "Active event selected", event });
  } catch (error) {
    res.status(500).json({ message: "Failed to select active event", error: error.message });
  }
};

// ================= GET ACTIVE EVENT (per user) =================
exports.getActiveEvent = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find user and populate activeEvent
    const user = await User.findById(userId).populate("activeEvent");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.activeEvent) {
      return res.status(404).json({ message: "No active event selected" });
    }

    res.status(200).json({ activeEvent: user.activeEvent });
  } catch (error) {
    res.status(500).json({ message: "Failed to get active event", error: error.message });
  }
};
// GET EVENT BY ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE EVENT
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({
      message: "Event updated successfully",
      event,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE EVENT
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({
      message: "Event deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};