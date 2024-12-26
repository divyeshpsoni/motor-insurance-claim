// import packages
import mongoose from "mongoose";

const ObjectId = mongoose.Schema.Types.ObjectId;

// feedback schema
const feedbackSchema = new mongoose.Schema(
  {
    claimID: {
      type: ObjectId,
      ref: "claims",
      required: true,
    },
    rating: {
      type: Number,
    },
    comment: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("feedbacks", feedbackSchema);
