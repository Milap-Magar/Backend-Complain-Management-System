const express = require("express");
const sessionMiddleware = require("./config/session.js");
const authMiddleware = require("./middleware/auth.middleware.js");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const routers = require("./routes/index.js");
// const bcrypt = require("bcrypt");

const app = express();

const pool = require("./config/database");
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());

app.use(sessionMiddleware);

app.use(express.json());
const publicDirectory = path.join(__dirname, "./public");
app.use(express.static(publicDirectory));

app.set("view engine", "hbs");

app.get("/", (req, res) => {
  res.render("index");
});

const adminRouter = require("./Routes/Admin.Routes");
app.use("/", adminRouter);

// const studentRouter = require("./Routes/Students.Routes.js");
// app.use("/admin", studentRouter);

app.post("/register", (req, res) => {
  const sql =
    "INSERT INTO students (name, dob, symbol, password, address, email, registration_no) VALUES (?)";
  bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
    if (err) {
      console.error("Error in hashing password:", err);
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
    pool.query(sql, [result], (err, results) => {
      if (err) {
        console.error("Error inserting data into database:", err);
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

app.listen(Port, () => {
  console.log(`Listening to PORT No. ${Port}`);
});

// Use all routers
routers.forEach((router) => {
  app.use(router);
});

// moment.tz.setDefault("Asia/Kolkata"); // Using 'Asia/Kolkata' as a workaround

// app.use((req, res, next) => {
//   // Manually adjust for the additional 15 minutes offset
//   moment.fn.ktm = function () {
//     return this.utcOffset(5 * 60 + 45);
//   };
//   next();
// });

// app.use("/images", express.static(path.join(__dirname, "images")));
// app.get("/api/images/:filename", authMiddleware.loggedIn, (req, res) => {
//   const filename = req.params.filename;
//   res.sendFile(path.join(__dirname, "images", filename));
// });

// const multer = require("multer");

// app.use((err, req, res, next) => {
//   console.log(err);
//   if (err instanceof multer.MulterError) {
//     return res.status(400).json({
//       error: "File upload error. Please check the file type and size.",
//     });
//   } else if (
//     err.message === "Invalid File type. Only Images of jpg/jpeg,png,gif,webp"
//   ) {
//     return res.status(400).json({ error: err.message });
//   } else if (err.message === "File size exceeds the allowed limit (2 MB).") {
//     return res.status(400).json({ error: err.message });
//   }
//   res.status(500).send("<h1>Something broke!</h1>");
// });
