const express = require("express");
const conn = require("../utils/database");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/adminlogin", (req, res) => {
  const sql = "SELECT * FROM students WHERE symbol = ? and password = ?";
  conn.query(sql, [req.body.symbol, req.body.password], (err, result) => {
    if (err) return res.json({ loginStatus: false, Error: "Query error" });
    if (result.length > 0) {
      const symbol = result[0].symbol;
      const token = jwt.sign(
        { role: "admin", symbol: symbol },
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

module.exports = { adminRouter: router };
