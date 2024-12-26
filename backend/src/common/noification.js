import nodemailer from "nodemailer";
import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

// nodemailer configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// twilio configuration
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// forgot-password send OTP via email
export const sendEmailOTP = async (to, otp) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: "Reset Password OTP",
      text: `OTP for resetting your password is: ${otp}`,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email.");
  }
};

// forgot-password send OTP via message/sms
export const sendSMSOTP = async (phoneNumber, otp) => {
  try {
    // METHOD 1 : twilio normal method (user-generated OTP, user-defined text body)
    await twilioClient.messages.create({
      body: `OTP for resetting your password is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${phoneNumber}`,
    });
    // // METHOD 2 : twilio verify service method (generates OTP by itself, has pre-defined text body)
    // await twilioClient.verify.v2
    //   .services(process.env.TWILIO_VERIFY_SERVICE_SID)
    //   .verifications.create({
    //     to: `+91${phoneNumber}`,
    //     channel: "sms",
    //   });
  } catch (error) {
    console.error("Error sending SMS:", error);
    throw new Error("Failed to send SMS.");
  }
};
