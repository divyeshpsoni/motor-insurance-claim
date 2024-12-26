// import packages
import express from "express";

// imports
import { authorized, isAdmin } from "../middleware/auth.js";
import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../controller/userController.js";

const userRoute = express.Router();

userRoute.get("/", authorized, isAdmin, getUsers);
userRoute.get("/:id", authorized, getUser);
userRoute.put("/:id", authorized, updateUser);
userRoute.delete("/:id", authorized, deleteUser);

export default userRoute;
