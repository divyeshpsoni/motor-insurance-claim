// import packages
import mongoose from "mongoose";

// imports
import {
  drivingLicenseValidator,
  emailValidator,
  panValidator,
  phoneNumberValidator,
  pincodeValidator,
  vehicleChassisValidator,
  vehicleRegValidator,
} from "../common/validator.js";

const ObjectId = mongoose.Schema.Types.ObjectId;

const claimSchema = new mongoose.Schema(
  {
    claimNumber: {
      type: String,
      unique: true,
      index: true,
      // ex: CLM-YYYYMMDD-XXXXX
    },
    userID: {
      type: ObjectId,
      ref: "users",
      required: true,
    },
    insuredPersonVehicleDetails: {
      insuredName: {
        type: String,
        required: true,
      },
      policyNumber: {
        type: String,
        required: true,
      },
      addressToCommunicate: {
        type: String,
        required: true,
      },
      pincode: {
        type: String,
        required: true,
        validate: [pincodeValidator, "Invalid pincode"],
      },
      phoneNumber: {
        type: String,
        required: true,
        validate: [phoneNumberValidator, "Invalid phone number"],
      },
      email: {
        type: String,
        required: true,
        validate: [emailValidator, "Invalid email address"],
      },
      panNumber: {
        type: String,
        required: true,
        validate: [panValidator, "Invalid PAN number"],
      },
      vehicleRegNumber: {
        type: String,
        required: true,
        validate: [vehicleRegValidator, "Invalid vehicle registration number"],
      },
      vehicleChassisNumber: {
        type: String,
        required: true,
        validate: [vehicleChassisValidator, "Invalid vehicle chassis number"],
      },
    },
    accidentDetails: {
      accidentDateTime: {
        type: Date,
        required: true,
      },
      accidentPlace: {
        type: String,
        required: true,
      },
      accidentCause: {
        type: String,
        required: true,
      },
    },
    driverDetails: {
      driverName: {
        type: String,
        required: true,
      },
      driverDOB: {
        type: Date,
        required: true,
      },
      drivingLicenseNumber: {
        type: String,
        required: true,
        validate: [drivingLicenseValidator, "Invalid driving license number"],
      },
      relationshipToDriver: {
        type: String,
        required: true,
        enum: ["Self", "Relative", "Friend", "Paid Driver", "Other"],
      },
      otherRelationship: {
        type: String,
        required: function () {
          return this.relationshipToDriver === "Other";
        },
      },
    },
    claimStatus: {
      type: String,
      required: true,
      enum: ["Pending", "Approved", "Rejected", "Appealed", "Cancelled"],
      default: "Pending",
    },
    garageID: {
      type: ObjectId,
      ref: "garages",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to generate claim number before saving to database
claimSchema.pre("save", async function (next) {
  // Only generate claim number if it's a new document
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    // Find the last claim number for today
    const lastClaim = await this.constructor
      .findOne({
        claimNumber: new RegExp(`CLM-${year}${month}${day}-.*`),
      })
      .sort({ claimNumber: -1 });

    let sequence = "00001";
    if (lastClaim) {
      const lastSequence = parseInt(lastClaim.claimNumber.split("-")[2]);
      sequence = String(lastSequence + 1).padStart(5, "0");
    }

    this.claimNumber = `CLM-${year}${month}${day}-${sequence}`;
  }
  next();
});

export default mongoose.model("claims", claimSchema);
