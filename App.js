const express = require("express");
const cors = require("cors");
// const router = require("./Routes/AdminRoutes");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  })
);

app.use(express.json());
const adminRouter = require("./Routes/AdminRoutes");
app.use("/auth", adminRouter);

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
