import path from "path";
import { paginate } from "../common/pagination.js";
import { validateUserAccess } from "../common/validateUserAccess.js";
import { model } from "../models/index.js";

// create claim
export const createClaim = async (req, res) => {
  const userID = req?.user?.userID;

  try {
    const insurancePolicyCopy = req?.files?.insurancePolicyCopy?.[0];
    const rcCopy = req?.files?.rcCopy?.[0];
    const damagedVehicleImages = req?.files?.damagedVehicleImages;

    const documentsFilePaths = {
      insurancePolicyCopy: insurancePolicyCopy
        ? path.join("uploads", insurancePolicyCopy.fileName)
        : undefined,
      rcCopy: rcCopy ? path.join("uploads", rcCopy.fileName) : undefined,
      damagedVehicleImages: damagedVehicleImages
        ? path.join("uploads", damagedVehicleImages.fileName)
        : undefined,
    };

    const userInput = {
      ...req?.body,
      userID,
      documents: documentsFilePaths,
    };

    const newClaim = await model.claimModel.create(userInput);

    res.status(201).json({ data: newClaim });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// get all claims
export const getClaims = async (req, res) => {
  try {
    // get paginated parameters from query (default to 1 and 10 if not provided)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // call paginate function
    const {
      items: claims,
      totalItems: totalClaims,
      pagination,
    } = await paginate(model.claimModel, {}, "", page, limit);

    res.status(200).json({ claims, totalClaims, pagination });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// get claim by id
export const getClaim = async (req, res) => {
  const { id } = req?.params;
  const userID = req?.user?.userID;
  const userType = req?.user?.userType;

  try {
    const claim = await model.claimModel.findById(id);
    if (!claim) {
      return res.status(404).json({ error: "Claim not found" });
    }

    // for customers, verify their own claim for update
    if (userType !== "admin" && claim.userID.toString() !== userID) {
      return res
        .status(403)
        .json({ error: "Access forbidden! Unauthorized person!" });
    }

    res.status(200).json(claim);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// get claims by userID (particular user's claims)
export const getUserClaims = async (req, res) => {
  const { id } = req?.params;

  try {
    // Validate user
    const { error } = await validateUserAccess(req, id);
    if (error) {
      return res.status(error.status).json({ error: error.message });
    }

    // get paginated parameters from query (default to 1 and 10 if not provided)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // defining query
    const query = { userID: id };

    // call paginate function
    const {
      items: claims,
      totalItems: totalClaims,
      pagination,
    } = await paginate(model.claimModel, query, "", page, limit);

    // get claims details with populated user details & garage details
    const populatedClaims = await model.claimModel.populate(claims, [
      {
        path: "userID",
        select: "firstName lastName phoneNumber email",
      },
      {
        path: "garageID",
        select: "garageName officePhoneNumber authorizedPerson locations",
      },
    ]);

    res.status(200).json({ claims: populatedClaims, totalClaims, pagination });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// get claims by garageID (particular garage's claims)
export const getGarageClaims = async (req, res) => {
  const { id } = req?.params;

  try {
    // get paginated parameters from query (default to 1 and 10 if not provided)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // defining query
    const query = { garageID: id };

    // call paginate function
    const {
      items: claims,
      totalItems: totalClaims,
      pagination,
    } = await paginate(model.claimModel, query, "-garageID", page, limit);

    // get claims details with populated user details
    const populatedClaims = await model.claimModel.populate(claims, [
      {
        path: "userID",
        select: "firstName lastName phoneNumber email",
      },
    ]);

    res.status(200).json({ claims: populatedClaims, totalClaims, pagination });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// update claim
export const updateClaim = async (req, res) => {
  const { id } = req?.params;
  const userID = req?.user?.userID;
  const userType = req?.user?.userType;

  try {
    // verify claim exist or not
    const claim = await model.claimModel.findById(id);
    if (!claim) {
      return res.status(404).json({ error: "Claim not found" });
    }

    // for customers, verify their own claim for update
    if (userType !== "admin" && claim.userID.toString() !== userID) {
      return res
        .status(403)
        .json({ error: "Access forbidden! Unauthorized person!" });
    }

    // extract fields from request body
    const {
      insuredPersonVehicleDetails,
      accidentDetails,
      driverDetails,
      claimStatus,
      garageID,
    } = req?.body;

    // create update object with only provided fields
    const updateFields = {};

    // handle claim status based on userType & current stays
    if (userType === "admin") {
      // admin can update any status
      if (claimStatus) {
        updateFields.claimStatus = claimStatus;
      }
    } else {
      // customer can cancel only pending claim or appeal for rejected claim
      if (claimStatus) {
        if (claimStatus === "Cancelled") {
          // only allow cancellation if status is Pending
          if (claim.claimStatus !== "Pending") {
            return res.status(400).json({
              error: `Can not cancel ${claim.claimStatus} claim!`,
            });
          }
          updateFields.claimStatus = "Cancelled";
        } else if (claimStatus === "Appealed") {
          // only allow appeal if status is Rejected
          if (claim.claimStatus !== "Rejected") {
            return res.status(400).json({
              error: `Can not appeal for ${claim.claimStatus} claim! Claim must be Rejected for Appeal.`,
            });
          }
          updateFields.claimStatus = "Appealed";
        } else {
          return res.status(403).json({
            error: `Customer can only Cancel or Appeal for the claim.`,
          });
        }
      }
    }

    // fields that customer & admin both can update
    if (insuredPersonVehicleDetails) {
      updateFields.insuredPersonVehicleDetails = insuredPersonVehicleDetails;
    }
    if (accidentDetails) {
      updateFields.accidentDetails = accidentDetails;
    }
    if (driverDetails) {
      updateFields.driverDetails = driverDetails;
    }

    // fields that only admin can update
    if (userType === "admin") {
      if (garageID) {
        updateFields.garageID = garageID;
      }
    }

    // update claim
    const updatedClaim = await model.claimModel.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    res.status(200).json(updatedClaim);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// delete claim
export const deleteClaim = async (req, res) => {
  const { id } = req?.params;

  try {
    // verify claim exist or not
    const claim = await model.claimModel.findById(id);
    if (!claim) {
      return res.status(404).json({ error: "Claim not found" });
    }

    const deletedClaim = await model.claimModel.findByIdAndDelete(id);
    res.status(200).json(deletedClaim);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
