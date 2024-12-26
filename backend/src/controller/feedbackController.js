import { model } from "../models/index.js";

// create feedback
export const createFeedback = async (req, res) => {
  const { id } = req?.params; // claimID
  const userID = req?.user?.userID;
  const userType = req?.user?.userType;
  const userInput = { ...req?.body, claimID: id };

  try {
    // find claim in claim model by param's id
    const claim = await model.claimModel.findById(id);

    // for customers, verify their own claim to give feedback
    if (userType !== "admin" && claim.userID.toString() !== userID) {
      return res
        .status(403)
        .json({ error: "Access forbidden! Unauthorized person!" });
    }

    // check whether feedback already exist or not
    const feedbackExist = await model.feedbackModel.findOne({ claimID: id });
    if (feedbackExist) {
      return res
        .status(400)
        .json({ error: "You have already provided feedback for this claim" });
    }

    // create new feedback
    const newFeedback = await model.feedbackModel.create(userInput);

    return res.status(201).json({ data: newFeedback });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// get feedback
export const getFeedback = async (req, res) => {
  const { id } = req?.params; // claimID

  try {
    const feedback = await model.feedbackModel.findOne({ claimID: id });
    if (!feedback) {
      return res.status(404).json({ error: "Feedback not found" });
    }

    return res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// update feedback
export const updateFeedback = async (req, res) => {
  const { id } = req?.params;

  try {
    // verify feedback exist or not
    const feedback = await model.feedbackModel.findById(id);
    if (!feedback) {
      return res.status(404).json({ error: "Feedback not found!" });
    }

    // extract fields from request body
    const { rating, comment } = req?.body;

    // Create update object with only provided fields
    const updateFields = {};
    if (rating) updateFields.rating = rating;
    if (comment) updateFields.comment = comment;

    // updated feedback
    const updatedFeedback = await model.feedbackModel.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    res.status(200).json(updatedFeedback);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// delete feedback
export const deleteFeedback = async (req, res) => {
  const { id } = req?.params;

  try {
    // verify feedback exist or not
    const feedback = await model.feedbackModel.findById(id);
    if (!feedback) {
      return res.status(404).json({ error: "Feedback not found!" });
    }

    const deletedFeedback = await model.feedbackModel.findByIdAndDelete(id);
    res.status(200).json(deletedFeedback);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
