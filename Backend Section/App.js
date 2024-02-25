const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const conn = require("./utils/database");
const app = express();
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  })
);

const adminRouter = require("./Routes/Admin.Routes");
app.use("/", adminRouter);

const studentRouter = require("./Routes/Students.Routes");
app.use("/", studentRouter);

app.get("/register", (req, res) => {
  res.send("HERE AM I");
});

// app.post("/register", (req, res) => {
//   const sql =
//     "INSERT INTO students ('name', 'dob', 'symbol', 'password', 'address', 'email', 'registration_no')VALUES(?)";
//   bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
//     if (err) return res.json({ Error: "Error in hashing password" });
//     const result = [
//       req.body.name,
//       req.body.dob,
//       req.body.symbol,
//       hash,
//       req.body.address,
//       req.body.email,
//       req.body.registration_no  
//     ];
//     conn.query(sql, [result], (err, results) => {
//       if (err) return res.json({ Error: "Inserting Data error" });
//       return res.json({ Status: "Success" });
//     });
//   });
// });

app.post("/register", (req, res) => {
  const sql =
    "INSERT INTO students (name, dob, symbol, password, address, email, registration_no) VALUES (?)";
  bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
    if (err) {
      console.error('Error in hashing password:', err);
      return res.json({ Error: "Error in hashing password" });
    }
    const result = [
      req.body.name,
      req.body.dob,
      req.body.symbol,
      hash,
      req.body.address,
      req.body.email,
      req.body.registration_no,
    ];
    conn.query(sql, [result], (err, results) => {
      if (err) {
        console.error('Error inserting data into database:', err);
        return res.json({ Error: "Inserting Data error" });
      }
      return res.json({ Status: "Success" });
    });
  });
});


const authenticateUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/auth/login");
  }
};

app.get("/dashboard", authenticateUser, (req, res) => {
  res.render("dashboard");
});

const Port = "8080";

app.listen(Port, () => {});
