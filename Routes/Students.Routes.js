const express = require("express");
const conn = require("../utils/database");
const jwt = require("jsonwebtoken");

const router = express.Router();

// router.get("/studentLogin",(req,res)=>{
//   res.send("here am i");
// })

router.post("studentslogin", (req, res) => {
  const sql = "SELECT * FROM students WHERE Symbol = ? and password = ?";
  conn.query(sql, [req.body.Symbol, req.body.password], (err, result) => {
    console.log("🚀 ~ conn.query ~ result:", result);
    if (err) return res.json({ loginStatus: false, Error: "Query error" });
    if (result.length > 0) {
      const Symbol = result[0].Symbol;
      const token = jwt.sign(
        { role: "student", Symbol: Symbol },
        "jwt_secret_key",
        { expiresIn: "1d" }
      );
      res.cookie("token", token);
      return res.json({ loginStatus: true });
    } else {
      return res.json({ loginStatus: false, Error: "Wrong Credentials !!" });
    }
  });
});

module.exports = router;
