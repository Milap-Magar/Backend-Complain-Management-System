const userModel = require("../model/user.model");
const generatePassword = require("../utils/password.utils");
const bcrypt = require("bcryptjs");
const sendCredential = require("../utils/sendCredentials.utils");
// const fs = require("fs");
// const path = require("path");
exports.registerUser = async (userData) => {
  try {
    // console.log(userData.email);
    const [results] = await userModel.getUserByEmail(userData.email);
    // console.log(results);
    if (results.length > 0) {
      const error = new Error("Email already used");
      error.status = 400;
      // error.message = "Email already used";
      throw error;
    }

    const password = generatePassword();
    let hashedPassword = await bcrypt.hash(password, 8);
    // console.log(hashedPassword);
    const user = { ...userData, password: hashedPassword };
    const newUser = await userModel.createUser(user);
    console.log(password);
    sendCredential(userData.email, password);
    return newUser;
  } catch (error) {
    console.log("error in userService", error);
    throw error;
  }
};

exports.deleteById = async (user_id) => {
  try {
    const [results] = await userModel.getUserById(user_id);
    if (results.length < 0) {
      throw { status: 200, message: "User Doesn't exist" };
    }
    await userModel.deleteUserById(user_id);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

exports.getAllUser = async () => {
  try {
    const [results] = await userModel.getUsers();
    return [results];
  } catch (error) {
    console.log("error at user service", error);
    throw error;
  }
};
exports.getUserCount = async () => {
  try {
    const [results] = await userModel.getUserCount();
    return [results];
  } catch (error) {
    console.log("error at user service", error);
    throw error;
  }
};
exports.getUserById = async (id) => {
  try {
    const [results] = await userModel.getUserById(id);
    return [results];
  } catch (error) {
    console.log("error at user service", error);
    throw error;
  }
};
exports.getOwnData = async (id) => {
  try {
    const [results] = await userModel.getOwnData(id);
    const contactsArray = results[0].contacts
      ? results[0].contacts.split(",")
      : [];
    const mixedResult = {
      ...results[0],
      contacts: contactsArray,
    };
    return [mixedResult];
  } catch (error) {
    console.log("error at user service", error);
    throw error;
  }
};
exports.getUserByEmail = async (email) => {
  try {
    const [results] = await userModel.getUserByEmail(email);
    return [results];
  } catch (error) {
    console.log("error at user service", error);
    throw error;
  }
};

exports.changePassword = async (password, user_id) => {
  try {
    const result = await userModel.updatePassword(password, user_id);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

exports.changeProfile = async (image, user_id) => {
  try {
    const result = await userModel.changeProfile(image, user_id);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
