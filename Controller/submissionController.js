const Submission = require("../Models/submissionModel");
const RunGroup = require("../Models/runGroupModel");
const makeService = require("../Services/makeWebHookService");

exports.createSubmission = async (req, res) => {
  try {
    const { submissionId, eventId, payload } = req.body;

    if (!submissionId || !eventId || !payload) {
      return res.status(400).json({
        message: "submissionId, eventId and payload are required",
      });
    }

    // 🔁 Deduplication check
    const existing = await Submission.findOne({ submissionId });
    if (existing) {
      return res.status(200).json({
        message: "Submission already processed",
        status: existing.status,
      });
    }

    // 🎯 Get run group for event
    const runGroupData = await RunGroup.findOne({ eventId });
    if (!runGroupData) {
      return res.status(400).json({
        message: "Run group not set for this event",
      });
    }

    // 🧱 Save submission (PENDING)
    const submission = await Submission.create({
      submissionId,
      eventId,
      runGroup: runGroupData.normalized,
      payload,
      userId: req.user.id,
    });

    // 🚀 Send to Make.com
    const makeResponse = await makeService.sendToMake({
      submissionId,
      eventId,
      runGroup: runGroupData.normalized,
      payload,
      userId: req.user.id,
      timestamp: new Date().toISOString(),
    });

    if (makeResponse.success) {
      submission.status = "SENT";
    } else {
      submission.status = "FAILED";
      submission.error = makeResponse.error;
    }

    await submission.save();

    res.status(201).json({
      message: "Submission processed",
      status: submission.status,
    });
  } catch (error) {
    res.status(500).json({
      message: "Submission failed",
      error: error.message,
    });
  }
};


// ================= GET ALL SUBMISSIONS =================
exports.getAllSubmissions = async (req, res) => {
  try {
    // Only OWNER can access
    if (req.user.role !== "OWNER") {
      return res.status(403).json({ message: "Access denied" });
    }

    const submissions = await Submission.find().populate("user", "name email role").populate("eventId");
    res.status(200).json({ submissions });
  } catch (error) {
    res.status(500).json({ message: "Failed to get submissions", error: error.message });
  }
};

// ================= RETRY FAILED SUBMISSION =================
exports.retryFailedSubmission = async (req, res) => {
  try {
    if (req.user.role !== "OWNER") {
      return res.status(403).json({ message: "Access denied" });
    }

    const submissionId = req.params.id;

    // Find submission
    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    if (submission.status !== "FAILED") {
      return res.status(400).json({ message: "Only FAILED submissions can be retried" });
    }

    // Send again to Make.com
    const makeResponse = await makeService.sendToMake({
      submissionId: submission.submissionId,
      eventId: submission.eventId,
      runGroup: submission.runGroup,
      payload: submission.payload,
      userId: submission.userId,
      timestamp: new Date().toISOString(),
    });

    if (makeResponse.success) {
      submission.status = "SENT";
      submission.last_error = null;
    } else {
      submission.status = "FAILED";
      submission.last_error = makeResponse.error;
    }

    await submission.save();

    res.status(200).json({
      message: "Retry processed",
      status: submission.status,
      last_error: submission.last_error,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to retry submission", error: error.message });
  }
};


exports.getSubmissionById = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission)
      return res.status(404).json({ message: "Submission not found" });
    res.json(submission);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET submissions by event
exports.getSubmissionsByEvent = async (req, res) => {
  try {
    const submissions = await Submission.find({ eventId: req.params.eventId });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET submissions by user
exports.getSubmissionsByUser = async (req, res) => {
  try {
    const submissions = await Submission.find({ userId: req.params.userId });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE submission (payload/status)
exports.updateSubmission = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission)
      return res.status(404).json({ message: "Submission not found" });

    const { payload, status } = req.body;
    if (payload) submission.payload = payload;
    if (status) submission.status = status;

    await submission.save();
    res.json({ message: "Submission updated", submission });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE submission
exports.deleteSubmission = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission)
      return res.status(404).json({ message: "Submission not found" });

    await submission.remove();
    res.json({ message: "Submission deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};