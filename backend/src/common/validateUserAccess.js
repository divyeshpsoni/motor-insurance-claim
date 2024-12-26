import { model } from "../models/index.js";

export const validateUserAccess = async (req, id) => {
  try {
    // find user in db by id
    const user = await model.userModel.findById(id);
    if (!user) {
      return { error: { status: 404, message: "User not found" } };
    }

    // Admin can access any user, Users can access only their own profile
    if (req.user.userType !== "admin" && req.user.userID !== id) {
      return {
        error: { status: 403, message: "Unauthorized: Permission denied!" },
      };
    }

    // User can not access Admin profile
    if (req.user.userType === "customer" && user.userType === "admin") {
      return {
        error: { status: 403, message: "Unauthorized: Permission denied!" },
      };
    }

    return { user };
  } catch (error) {
    return { error: { status: 500, message: "Internal server error" } };
  }
};
