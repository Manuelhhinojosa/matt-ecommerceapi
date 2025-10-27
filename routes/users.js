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
router.get("/:id", protect, admin, usersController.getOneUser);
router.delete("/:id", protect, admin, usersController.deleteUser);
router.put("/:id", protect, admin, usersController.editUser);
module.exports = router;
