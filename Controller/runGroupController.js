const RunGroup = require("../Models/runGroupModel");
const normalizeRunGroup = require("../Utlis/runGroupNormalize");

// SET RUN GROUP (OWNER)
exports.setRunGroup = async (req, res) => {
  try {
    const { eventId, rawText } = req.body;

    if (!eventId || !rawText) {
      return res.status(400).json({ message: "Event and run group required" });
    }

    const normalized = normalizeRunGroup(rawText);
    if (!normalized) {
      return res.status(400).json({ message: "Invalid run group" });
    }

    const existing = await RunGroup.findOne({ eventId });
    if (existing) {
      return res.status(409).json({ message: "Run group already set" });
    }

    const runGroup = await RunGroup.create({
      eventId,
      rawText,
      normalized,
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Run group set successfully",
      runGroup,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET RUN GROUP (ALL USERS)
exports.getRunGroup = async (req, res) => {
  try {
    const runGroup = await RunGroup.findOne({
      eventId: req.params.eventId,
    });

    if (!runGroup) {
      return res.status(404).json({ message: "Run group not set yet" });
    }

    res.status(200).json(runGroup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRunGroup = async (req, res) => {
  try {
    const runGroup = await RunGroup.findOne({ eventId: req.params.eventId });

    if (!runGroup) {
      return res.status(404).json({ message: "Run group not set yet" });
    }

    res.status(200).json(runGroup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= UPDATE RUN GROUP (OWNER) =================
exports.updateRunGroup = async (req, res) => {
  try {
    const { eventId, rawText } = req.body;

    if (!eventId || !rawText) {
      return res.status(400).json({ message: "Event and run group required" });
    }

    const normalized = normalizeRunGroup(rawText);
    if (!normalized) {
      return res.status(400).json({ message: "Invalid run group" });
    }

    const runGroup = await RunGroup.findOne({ eventId });
    if (!runGroup) {
      return res.status(404).json({ message: "Run group not found" });
    }

    runGroup.rawText = rawText;
    runGroup.normalized = normalized;
    await runGroup.save();

    res.status(200).json({ message: "Run group updated successfully", runGroup });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= DELETE RUN GROUP (OWNER) =================
exports.deleteRunGroup = async (req, res) => {
  try {
    const runGroup = await RunGroup.findOne({ eventId: req.params.eventId });

    if (!runGroup) {
      return res.status(404).json({ message: "Run group not found" });
    }

    await runGroup.remove();

    res.status(200).json({ message: "Run group deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};