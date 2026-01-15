const express = require("express");
const router = express.Router();

const runGroupController = require("../Controller/runGroupController");
const {authToken,authorizeRoles} = require("../MiddleWare/authMiddleWare");

// ================= Create RUN GROUP=================

// OWNER only
router.post(
  "/rungroupregister",
  authToken,
  authorizeRoles("OWNER"),
  runGroupController.setRunGroup
);
// ================= GET RUN GROUP=================

// OWNER + MECHANIC
console.log("run-group routes loaded");

router.get(
  "/rungroupget/:eventId",
  authToken,
  runGroupController.getRunGroup
);

// ================= GET RUN GROUP BY EVENT =================
router.get("/get/:eventId", authToken, runGroupController.getRunGroup);

// ================= UPDATE RUN GROUP =================
router.put("/update", authToken, authorizeRoles("OWNER"), runGroupController.updateRunGroup);

// ================= DELETE RUN GROUP =================
router.delete("/delete/:eventId", authToken, authorizeRoles("OWNER"), runGroupController.deleteRunGroup);

module.exports = router;