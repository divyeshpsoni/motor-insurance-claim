// import packages
import mongoose from "mongoose";

// imports
import { phoneNumberValidator } from "../common/validator.js";

// garage schema
const garageSchema = new mongoose.Schema(
  {
    garageName: {
      type: String,
      required: true,
      unique: true,
    },
    officePhoneNumber: {
      type: String,
      required: true,
      validate: [phoneNumberValidator, "Invalid phone number"],
    },
    authorizedPerson: [
      {
        authorizedPersonName: {
          type: String,
          required: true,
        },
        authorizedPersonPhoneNumber: [
          {
            type: String,
            required: true,
            validate: [phoneNumberValidator, "Invalid phone number"],
          },
        ],
      },
    ],
    locations: [
      {
        state: {
          type: String,
          required: true,
        },
        city: {
          type: String,
          required: true,
        },
        address: {
          type: String,
          required: true,
        },
        geoLocation: {
          latitude: {
            type: Number,
            required: true,
          },
          longitude: {
            type: Number,
            required: true,
          },
        },
      },
    ],
    workingDaysTime: {
      days: {
        type: String,
        required: true,
      },
      time: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("garages", garageSchema);
