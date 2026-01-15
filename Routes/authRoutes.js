const express=require("express");
const router=express.Router();
router.use(express.json());
const jwt =require("jsonwebtoken");
const {authToken} = require("../MiddleWare/authMiddleWare")
console.log("✅ authRoutes loaded");

const authController=require("../Controller/authController");
router.post("/signup",authController.registerUsers);
router.post("/login",authController.logInUsers);
router.post("/logout", authController.logoutUser);
router.get("/me", authToken, authController.getMe);
module.exports=router;