var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const { Sequelize, DataTypes } = require("sequelize");
const User = require("./user.model");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});


// Test the User model
(async () => {
  try {
    // Sync the model with the database
    await sequelize.sync();

    // Create a new user
    const newUser = await User.create({
      username: "example_user",
      symbol_number: "12345678",
      password: "examplepassword",
    });

    console.log("New user created:", newUser.toJSON());

    // Find a user by username
    const foundUser = await User.findOne({
      where: { username: "example_user" },
    });

    console.log("Found user:", foundUser.toJSON());

    // Update a user
    await foundUser.update({ password: "newpassword" });

    // Delete a user
    await foundUser.destroy();
  } catch (error) {
    console.error("Error:", error);
  } finally {
    // Close the database connection
    await sequelize.close();
  }
})();

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
