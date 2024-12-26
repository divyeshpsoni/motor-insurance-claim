// import packages
import mongoose from "mongoose";
import bcrypt from "bcrypt";

// imports
import { emailValidator, phoneNumberValidator } from "../common/validator.js";

// userSchema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: null,
    },
    userType: {
      type: String,
      enum: ["admin", "customer"],
      default: "customer",
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      validate: [phoneNumberValidator, "Invalid phone number"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [emailValidator, "Invalid email address"],
    },
    passwordHash: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      default: null,
    },
    codeExpiry: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Pre-save hook to bcrypt/hash password before saving to database
userSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHash")) {
    return next();
  }
  try {
    this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model("users", userSchema);
