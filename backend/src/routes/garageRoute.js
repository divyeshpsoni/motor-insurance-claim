// import packages
import express from "express";

// imports
import { authorized, isAdmin } from "../middleware/auth.js";
import {
  createGarage,
  deleteGarage,
  getGarage,
  getGarages,
  updateGarage,
} from "../controller/garageController.js";

const garageRoute = express.Router();

garageRoute.post("/", authorized, isAdmin, createGarage);
garageRoute.get("/", authorized, isAdmin, getGarages);
garageRoute.get("/:id", getGarage);
garageRoute.put("/:id", authorized, isAdmin, updateGarage);
garageRoute.delete("/:id", authorized, isAdmin, deleteGarage);

export default garageRoute;
