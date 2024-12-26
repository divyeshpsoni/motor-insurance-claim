import validator from "validator";

// phone number validator
export const phoneNumberValidator = (phoneNumber) => {
  return validator.isMobilePhone(phoneNumber, "en-IN"); // ex: true/false
};

// email id validator
export const emailValidator = (email) => {
  return validator.isEmail(email); // ex: true/false
};

// pincode validator
export const pincodeValidator = (pincode) => {
  const pincodeRegex = /^\d{6}$/; // ex: 123456
  return pincodeRegex.test(pincode);
};

// pan number validator
export const panValidator = (panNumber) => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/; // ex: ABCDE1234F
  return panRegex.test(panNumber);
};

// vehicle registration number validator
export const vehicleRegValidator = (vehicleRegNumber) => {
  const regRegex = /^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/; // ex: GJ01AB1234
  return regRegex.test(vehicleRegNumber);
};

// vehicle chassis number validator
export const vehicleChassisValidator = (vehicleChassisNumber) => {
  const chassisRegex = /^[A-HJ-NPR-Z0-9]{17}$/; // ex: A1234567890B12345
  return chassisRegex.test(vehicleChassisNumber);
};

// driving license number validator
export const drivingLicenseValidator = (drivingLicenseNumber) => {
  const dlRegex = /^[A-Z]{2}[0-9]{4}[A-Z]{1}[0-9]{7}$/; // ex: DL1234A1234567
  return dlRegex.test(drivingLicenseNumber);
};
