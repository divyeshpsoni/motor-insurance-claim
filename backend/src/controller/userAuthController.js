// import packages
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

// imports
import { model } from "../models/index.js";
import { sendEmailOTP, sendSMSOTP } from "../common/noification.js";

// create/register/signUp user
export const createUser = async (req, res) => {
  const userInput = req?.body;
  try {
    // check if user already exist // phone number & email must be unique
    const userExist = await model.userModel.findOne({
      $or: [
        { phoneNumber: userInput?.phoneNumber },
        { email: userInput?.email },
      ],
    });
    if (userExist) {
      return res.status(400).json({ error: "User already exist" });
    }

    // create new user
    const newUser = await model.userModel.create(userInput);

    // generate jwt token
    const token = jwt.sign(
      {
        userID: newUser._id,
        email: newUser.email,
      },
      process.env.JWT_SECRET
    );

    return res.json({
      status: 201,
      data: newUser,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// login/signIn user
export const loginUser = async (req, res) => {
  const { email, phoneNumber, passwordHash } = req?.body;
  try {
    let userExist;

    if (email) {
      // login via email
      if (!passwordHash) {
        return res.status(400).json({ error: "Password is required" });
      }
      userExist = await model.userModel.findOne({ email });
    } else if (phoneNumber) {
      // login via phoneNumber
      userExist = await model.userModel.findOne({ phoneNumber });
    } else {
      // if neither email or phone numberis provided
      return res
        .status(400)
        .json({ error: "Email or phone number is required!" });
    }

    if (!userExist) {
      return res.status(404).json({ error: "User not found!" });
    }

    // Validate password if email is used for login
    if (email && passwordHash) {
      // comapre password
      const isPassMatch = await bcrypt.compare(
        passwordHash,
        userExist.passwordHash
      );
      if (!isPassMatch) {
        return res.status(400).json({ error: "Invalid password!" });
      }
    }

    // generate jwt token
    const token = jwt.sign(
      {
        userID: userExist._id,
        email: userExist.email,
        userType: userExist.userType,
      },
      process.env.JWT_SECRET
    );

    return res.json({
      status: 200,
      data: userExist,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// forgot-password (send otp via email & message)
export const forgotPassword = async (req, res) => {
  const { email } = req?.body;
  try {
    const userExist = await model.userModel.findOne({ email });
    if (!userExist) {
      return res.status(404).json({ error: "User not found!" });
    }

    // generate 6 digit OTP
    const otp = Math.trunc(Math.random() * 1000000)
      .toString()
      .padStart(6, "0");

    // set OTP & OTP expiry time in database
    userExist.code = otp;
    userExist.codeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    await userExist.save();

    // generate jwt token to validate same user on otp & reset password pages
    const token = jwt.sign(
      {
        userID: userExist._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // send OTP via email & sms
    // await sendEmailOTP(userExist.email, otp);
    // await sendSMSOTP(userExist.phoneNumber, otp);

    res.status(200).json({
      message: "OTP sent successfully to your email and phone number.",
      token,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// verify OTP
export const verifyOTP = async (req, res) => {
  const { otp } = req?.body;
  try {
    //get userID from authorized middleware
    const userID = req.user.userID;

    const userExist = await model.userModel.findById(userID);
    if (!userExist) {
      return res.status(404).json({ error: "User not found!" });
    }

    // validate OTP
    if (!userExist?.code || userExist?.code !== otp) {
      return res.status(400).json({ error: "Invalid OTP!" });
    }

    // validate OTP expiry
    if (new Date() > userExist?.codeExpiry) {
      return res.status(400).json({ error: "OTP has expired!" });
    }

    // OTP is valid, clear the fields
    userExist.code = null;
    userExist.codeExpiry = null;
    await userExist.save();

    res.status(200).json({ message: "OTP verified successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// reset password
export const resetPassword = async (req, res) => {
  const { newPassword } = req?.body;

  try {
    // get userID from authorized middleware
    const userID = req.user.userID;

    const userExist = await model.userModel.findById(userID);
    if (!userExist) {
      return res.status(404).json({ error: "User not found" });
    }

    // update new password in database
    userExist.passwordHash = newPassword;
    await userExist.save();

    res.status(200).json({ message: "Password reset successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
