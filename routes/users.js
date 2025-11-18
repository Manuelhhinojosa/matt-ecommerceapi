// dependencies
var express = require("express");
var router = express.Router();

// controllers (functinos)
const usersController = require("../controllers/users");

// middleware functions
const { protect, admin } = require("../middleware/authMiddleware");

// Users routes: /users
router.get("/", usersController.users);
router.post("/register", usersController.registerUser);
router.post("/login", usersController.userLogin);
router.get("/allusers", protect, admin, usersController.getAllUsers);
router.get("/:id", protect, usersController.getOneUser);
router.delete("/:id", protect, admin, usersController.deleteUser);
// this one:
router.patch("/:id", protect, usersController.editUserPassword);
router.put("/editcontact/:id", protect, usersController.editContactUser);
router.put("/editshipping/:id", protect, usersController.editShippingtUser);
router.patch("/inactivateprofile", protect, usersController.inactivateUser);
router.patch("/reactivateprofile", protect, usersController.reactivateUser);

module.exports = router;
