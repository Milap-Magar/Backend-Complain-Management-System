const { getUserById } = require("../model/user.model");

exports.loggedIn = async (req, res, next) => {
  console.log("session", req.session);
  try {
    if (req.session && req.session.user_id) {
      const user_id = req.session.user_id;
      const [user] = await getUserById(user_id);
      req.user = user[0];
      next();
    } else {
      return res
        .status(401)
        .json({ authenticated: false, message: "Unauthorized" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
    // console.log(error);
  }
};

exports.isAdmin = (req, res, next) => {
//   console.log(req.user)
  if (req.user && req.user.role == "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Permission denied" });
  }
};

exports.isTeacher = (req, res, next) => {
  //   console.log(req.user);
  // console.log("hello");
  if (req.user && req.user.role == "teacher") {
    // console.log("Access Granted");
    next();
  } else {
    // console.log(req.user.role);
    return res.status(403).json({ message: "Permission denied" });
  }
};

exports.isStudent = (req, res, next) => {
  //   console.log(req.user);
  console.log("user", req.user);
  if (req.user && req.user.role == "student") {
    next();
  } else {
    return res.status(403).json({ message: "Permission denied" });
  }
};
exports.isTeacherOrAdmin = (req, res, next) => {
  //   console.log(req.user);
  if (req.user && (req.user.role == "admin" || req.user.role == "teacher")) {
    next();
  } else {
    return res.status(403).json({ message: "Permission denied" });
  }
};