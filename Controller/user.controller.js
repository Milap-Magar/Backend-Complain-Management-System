const { pool } = require("../config/database");
const userService = require("../service/user.service");
// const adminService = require("../services/adminService");
// const teacherService = require("../services/teacherService");
// const studentService = require("../services/studentService");

exports.register = async (req, res) => {
  // console.log(req.body);

  try {
    const userData = req.body;
    const { subject_id } = req.body;
    // console.log(imageBuffer);
    const { class_id, section_id, blood_group, nationality } = req.body;
    // console.log("userData",userData)
    const result = await userService.registerUser(userData);

    switch (userData.role) {
      case "admin":
        await adminService.insertAdminData(result.insertId);
        break;
      case "student":
        await studentService.insertStudentData(
          result.insertId,
          class_id,
          section_id,
          blood_group,
          nationality
        );
        break;
      case "teacher":
        await teacherService.insertTeacherData(result.insertId, subject_id);
        break;
      default:
        const error = new Error("Role undefined");
        error.status(402);
        throw error;
    }

    return res.json({ message: "Done", insertId: result.insertId });
  } catch (error) {
    if (error.status && error.message) {
      res.status(error.status).json({ error: error.message });
    } else {
      console.log("error at userController", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

exports.getAllUser = async (req, res, next) => {
  // console.log(req.session);
  try {
    const [rows] = await userService.getAllUser();
    res.status(200).json({ data: rows });
  } catch (error) {
    console.log(error);
  }
};
exports.getUserCount = async (req, res, next) => {
  // console.log(req.session);
  try {
    const [rows] = await userService.getUserCount();
    res.status(200).json({ data: rows });
  } catch (error) {
    console.log(error);
  }
};

exports.updateUser = async (req, res, next) => {
  console.log(req.body);
  const {
    email,
    fname,
    mname,
    lname,
    dob,
    role,
    password,
    cpassword,
    contacts,
    temp_address,
    perm_address,
  } = req.body;

  try {
    const [results] = await pool.query("SELECT * FROM user WHERE email = ?", [
      email,
    ]);
    console.log(results);
    if (results.length > 0) {
      return res.status(400).json({ error: "Email already used" });
    }
    if (password !== cpassword) {
      return res.status(400).json({ error: "Password Doesn't Match" });
    }
    let hashedPassword = await bcrypt.hash(password, 8);
    // console.log(hashedPassword);

    const [result] = await pool.query(
      `INSERT INTO user ( fname, mname, lname, dob, email, password, role) Values (?,?, ?, ?, ?,?,?)`,
      [fname, mname, lname, dob, email, hashedPassword, role]
    );
    const user_id = result.insertId;
    for (const contact of contacts) {
      await pool.query(
        "INSERT INTO user_contact (user_id, contact) VALUES (?,?)",
        [user_id, contact]
      );
    }
    await pool.query(
      "INSERT INTO user_address (user_id, address, address_type) VALUES (?,?,?)",
      [user_id, temp_address, "temporary"]
    );
    await pool.query(
      "INSERT INTO user_address (user_id, address, address_type) VALUES (?,?,?)",
      [user_id, perm_address, "permanent"]
    );
    return res.json({ message: "Done", insertId: result.insertId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteUserById = async (req, res, next) => {
  try {
    // console.log(req.params.id);
    const user_id = req.params.id;
    await userService.deleteById(user_id);
    res.status(200).json({ message: "Delete Success" });
  } catch (error) {
    if (error.status && error.message) {
      res.status(error.status).json({ error: error.message });
    }
    console.log(error);
  }
};
exports.getUserById = async (req, res, next) => {
  try {
    // console.log(req.params.id);
    const user_id = req.params.id;
    const [result] = await userService.getUserById(user_id);
    console.log(result);
    res.status(200).json({ message: result });
  } catch (error) {
    if (error.status && error.message) {
      res.status(error.status).json({ error: error.message });
    }
    console.log(error);
  }
};
exports.getOwnDetail = async (req, res, next) => {
  try {
    // console.log(req.params.id);
    const user_id = req.session.user_id;
    const [result] = await userService.getOwnData(user_id);
    console.log(result);
    res.status(200).json({ data: result });
  } catch (error) {
    if (error.status && error.message) {
      res.status(error.status).json({ error: error.message });
    }
    console.log(error);
  }
};

exports.changeProfilePicture = async (req, res, next) => {
  try {
    const image = req.file;
    const user_id = req.session.user_id;
    const result = await userService.changeProfile(image.filename, user_id);
    console.log("requst", image);

    res.status(200).json({ message: "Image Uploaded" });
  } catch (error) {
    console.log("Error at authController changing picture", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};