const express = require("express");
const {
  getAllUser,
  //   deleteUserById,
  register,
  getUserById,
  //   getOwnDetail,
  //   changeProfilePicture,
  getUserCount,
} = require("../controllers/userController");
const { loggedIn, isAdmin } = require("../middleware/auth.middleware");
// const upload = require("../middleware/multer.middleware");

const router = express.Router();
router.post("/api/register", loggedIn, isAdmin, register);
// router.post(
//   "/api/changeprofile",
//   loggedIn,
//   upload.single("image"),

//   changeProfilePicture
// );
router.get("/api/users", loggedIn, isAdmin, getAllUser);
router.get("/api/users/count", loggedIn, isAdmin, getUserCount);
router.get("/api/users/:id", loggedIn, isAdmin, getUserById);
// router.get("/api/myprofile", loggedIn, getOwnDetail);
// router.delete("/api/users/:id", loggedIn, isAdmin, deleteUserById);

module.exports = router;
