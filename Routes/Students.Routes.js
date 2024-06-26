const express = require("express");
const conn = require("../config/database");
// const jwt = require("jsonwebtoken");

const router = express.Router();

const { loggedIn, isAdmin } = require("../middleware/auth.middleware");
const studentController = require("../Controller/students.Controller");

router.get("/api/students",loggedIn,isAdmin,studentController.getAllStudents)


// router.post("/studentslogin", (req, res) => {
//   const sql = "SELECT * FROM students WHERE Symbol = ? and password = ?";
//   conn.query(sql, [req.body.Symbol, req.body.password], (err, result) => {
//     console.log("🚀 ~ conn.query ~ result:", result);
//     if (err) return res.json({ loginStatus: false, Error: "Query error" });
//     if (result.length > 0) {
//       const Symbol = result[0].Symbol;
//       const token = jwt.sign(
//         { role: "student", Symbol: Symbol },
//         "jwt_secret_key",
//         { expiresIn: "1d" }
//       );
//       res.cookie("token", token);
//       return res.json({ loginStatus: true });
//     } else {
//       return res.json({ loginStatus: false, Error: "Wrong Credentials !!" });
//     }
//   });
// });

module.exports = router;
