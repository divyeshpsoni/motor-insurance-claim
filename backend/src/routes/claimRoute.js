// import packages
import express from "express";

// imports
import { authorized, isAdmin } from "../middleware/auth.js";
import {
  createClaim,
  deleteClaim,
  getClaim,
  getClaims,
  getGarageClaims,
  getUserClaims,
  updateClaim,
} from "../controller/claimController.js";

const claimRoute = express.Router();

claimRoute.post("/", authorized, createClaim);
claimRoute.get("/", authorized, isAdmin, getClaims);
claimRoute.get("/:id", authorized, getClaim);
claimRoute.get("/user/:id", authorized, getUserClaims);
claimRoute.get("/garage/:id", authorized, isAdmin, getGarageClaims);
claimRoute.put("/:id", authorized, updateClaim);
claimRoute.delete("/:id", authorized, isAdmin, deleteClaim);

export default claimRoute;
