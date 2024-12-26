import { paginate } from "../common/pagination.js";
import { validateUserAccess } from "../common/validateUserAccess.js";
import { model } from "../models/index.js";

// get all users
export const getUsers = async (req, res) => {
  try {
    // get paginated parameters from query (default to 1 and 10 if not provided)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // call paginate function
    const {
      items: users,
      totalItems: totalUsers,
      pagination,
    } = await paginate(
      model.userModel,
      {},
      "-passwordHash -code -codeExpiry",
      page,
      limit
    );

    res.status(200).json({ users, totalUsers, pagination });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// get user by id
export const getUser = async (req, res) => {
  const { id } = req?.params;

  try {
    // validate user
    const { error, user } = await validateUserAccess(req, id);
    if (error) {
      return res.status(error.status).json({ error: error.message });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// update user
export const updateUser = async (req, res) => {
  const { id } = req?.params;

  // extract fields from request body
  const { firstName, lastName } = req?.body;

  try {
    // validate user
    const { error } = await validateUserAccess(req, id);
    if (error) {
      return res.status(error.status).json({ error: error.message });
    }

    // update user details
    const updateUser = await model.userModel.findByIdAndUpdate(
      id,
      { firstName, lastName },
      { new: true }
    );
    res.status(200).json(updateUser);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// delete user
export const deleteUser = async (req, res) => {
  const { id } = req?.params;

  try {
    // validate user
    const { error } = await validateUserAccess(req, id);
    if (error) {
      return res.status(error.status).json({ error: error.message });
    }

    // delete user
    const deletedUser = await model.userModel.findByIdAndDelete(id);
    res.status(200).json(deletedUser);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
