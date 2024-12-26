// Import packages
import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environmental variable
dotenv.config();

// Connect with database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database connected successfully");
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
