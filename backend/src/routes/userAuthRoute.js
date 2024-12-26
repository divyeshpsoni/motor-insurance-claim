// import packages
import express from "express";

// imports
import { authorized } from "../middleware/auth.js";
import {
  createUser,
  forgotPassword,
  loginUser,
  resetPassword,
  verifyOTP,
} from "../controller/userAuthController.js";

const userAuthRoute = express.Router();

userAuthRoute.post("/register", createUser);
userAuthRoute.post("/login", loginUser);
userAuthRoute.post("/forgot-password", forgotPassword);
userAuthRoute.post("/verify-otp", authorized, verifyOTP);
userAuthRoute.post("/reset-password", authorized, resetPassword);

export default userAuthRoute;
