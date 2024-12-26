import { paginate } from "../common/pagination.js";
import { model } from "../models/index.js";

// create garage
export const createGarage = async (req, res) => {
  const userInput = req?.body;

  try {
    // check if garage already exist // by garageName
    const garageExist = await model.garageModel.findOne({
      garageName: userInput.garageName,
    });
    if (garageExist) {
      return res.status(400).json({ error: "Garage already exist!" });
    }

    // create new garage
    const newGarage = await model.garageModel.create(userInput);

    return res.json({
      status: 201,
      data: newGarage,
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
      details: error.message || error,
    });
  }
};

// get all garages
export const getGarages = async (req, res) => {
  try {
    // get paginated parameters from query (default to 1 and 10 if not provided)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // call paginate function
    const {
      items: garages,
      totalItems: totalGarages,
      pagination,
    } = await paginate(model.garageModel, {}, "", page, limit);

    res.status(200).json({ garages, totalGarages, pagination });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// get garage by id
export const getGarage = async (req, res) => {
  const { id } = req?.params;
  try {
    const garage = await model.garageModel.findById(id);
    if (!garage) {
      return res.status(404).json({ error: "Garage not found" });
    }

    res.status(200).json(garage);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// update garage
export const updateGarage = async (req, res) => {
  const { id } = req?.params;

  try {
    // verify garage exist or not
    const garage = await model.garageModel.findById(id);
    if (!garage) {
      return res.status(404).json({ error: "Garage not found" });
    }

    // extract fields from request body
    const { officePhoneNumber, authorizedPerson, locations, workingDaysTime } =
      req?.body;

    // Create update object with only provided fields
    const updateFields = {};
    if (officePhoneNumber) updateFields.officePhoneNumber = officePhoneNumber;
    if (authorizedPerson) updateFields.authorizedPerson = authorizedPerson;
    if (locations) updateFields.locations = locations;
    if (workingDaysTime) updateFields.workingDaysTime = workingDaysTime;

    // Update garage
    const updatedGarage = await model.garageModel.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    res.status(200).json(updatedGarage);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// delete garage
export const deleteGarage = async (req, res) => {
  const { id } = req?.params;

  try {
    // verify garage exist or not
    const garage = await model.garageModel.findById(id);
    if (!garage) {
      return res.status(404).json({ error: "Garage not found" });
    }

    const deletedGarage = await model.garageModel.findByIdAndDelete(id);
    res.status(200).json(deletedGarage);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
