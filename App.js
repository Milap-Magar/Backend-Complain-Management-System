const express = require("express");
const cors = require("cors");
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

const authenticateUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/auth/login");
  }
};

app.get("/auth/dashboard", authenticateUser, (req, res) => {
  res.render("dashboard");
});

const Port = "8080";

app.listen(Port, () => {});
