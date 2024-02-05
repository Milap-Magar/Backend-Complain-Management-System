const express = require("express");
const conn = require("../utils/database");
const jwt = require("jsonwebtoken");

const router = express.Router();

// router.get("/adminlogin",(req,res)=>{
//   res.send("here am i");
// })

router.post("/adminlogin", (req, res) => {
  const sql = "SELECT * FROM admins WHERE admin_no = ? and password = ?";
  conn.query(sql, [req.body.admin_no, req.body.password], (err, result) => {
    console.log("🚀 ~ conn.query ~ result:", result);
    if (err) return res.json({ loginStatus: false, Error: "Query error" });
    if (result.length > 0) {
      const adminId = result[0].admin_no;
      const token = jwt.sign(
        { role: "admin", admin_no: adminId },
        "jwt_secret_key",
        { expiresIn: "1d" }
      );
      res.cookie('token', token)
      return res.json({ loginStatus: true });
    }else{
        return res.json({ loginStatus: false, Error: "Wrong Credentials !!" });
    }
  });
});

module.exports = router;
