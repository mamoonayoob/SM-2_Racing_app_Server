const express = require("express");
const router = express.Router();

const eventController = require("../Controller/eventController");
const {authToken,authorizeRoles} = require("../MiddleWare/authMiddleWare");
console.log("event routes runiing")
// OWNER only
router.post(
  "/eventregister",
  authToken,
  authorizeRoles("OWNER"),
  eventController.createEvent
);


// OWNER + MECHANIC
router.get("/eventgetall", authToken, eventController.getEvents);

// ================= SELECT ACTIVE EVENT =================
router.post("/:id/select", authToken, eventController.selectActiveEvent);

// ================= GET ACTIVE EVENT =================
router.get("/active", authToken, eventController.getActiveEvent);

//get by id
router.get("/:id", authToken, eventController.getEventById);

// UPDATE (PUT)
router.put(
  "/:id",
  authToken,
  authorizeRoles("OWNER"),
  eventController.updateEvent
);

// DELETE
router.delete(
  "/:id",
  authToken,
  authorizeRoles("OWNER"),
  eventController.deleteEvent
);
module.exports = router;