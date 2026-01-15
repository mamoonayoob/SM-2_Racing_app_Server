const express = require("express");
const router = express.Router();

const submissionController = require("../Controller/submissionController");
const { authToken, authorizeRoles } = require("../MiddleWare/authMiddleWare");

// Create Submission
router.post("/create", authToken, submissionController.createSubmission);

// GET all submissions (OWNER only)
router.get("/", authToken, submissionController.getAllSubmissions);

// RETRY failed submission (OWNER only)
router.post("/:id/retry", authToken, submissionController.retryFailedSubmission);

// Get Submission by ID
router.get("/:id", authToken, submissionController.getSubmissionById);

// Get all submissions for Event
router.get("/event/:eventId", authToken, submissionController.getSubmissionsByEvent);

// Get all submissions by User
router.get("/user/:userId", authToken, submissionController.getSubmissionsByUser);

// Update submission (OWNER only)
router.put("/:id", authToken, authorizeRoles("OWNER"), submissionController.updateSubmission);

// Delete submission (OWNER only)
router.delete("/:id", authToken, authorizeRoles("OWNER"), submissionController.deleteSubmission);

module.exports = router;
