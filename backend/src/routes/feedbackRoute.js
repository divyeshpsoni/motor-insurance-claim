// import packages
import express from "express";

// imports
import { authorized, isAdmin } from "../middleware/auth.js";
import {
  createFeedback,
  deleteFeedback,
  getFeedback,
  updateFeedback,
} from "../controller/feedbackController.js";

const feedbackRoute = express.Router();

feedbackRoute.post("/:id", authorized, createFeedback);
feedbackRoute.get("/:id", authorized, isAdmin, getFeedback);
feedbackRoute.put("/:id", authorized, isAdmin, updateFeedback);
feedbackRoute.delete("/:id", authorized, isAdmin, deleteFeedback);

export default feedbackRoute;
