const express = require("express");
const userController = require("../controllers/userController.js");
const auth = require("../middlewares/auth.js");

const router = express.Router();

// Public routes
router.post("/register", userController.registerUser);
router.post("/register-admin", userController.registerAdmin);
router.post("/login", userController.loginUser);
router.post("/logout", userController.logoutUser);

// Protected routes (require authentication)
router.get("/", auth.verifyToken, userController.getAllUsers);
router.put("/:user_id", auth.verifyToken, userController.updateUser);
router.delete("/:user_id", auth.verifyToken, userController.deleteUser);

// Token refresh route
router.get("/refresh", auth.verifyRefreshToken, userController.verifyAuth);

module.exports = router;
