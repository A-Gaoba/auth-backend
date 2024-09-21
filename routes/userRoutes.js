// routes/userRoutes.js
const express = require("express");
const { register, login, getChat } = require("../controllers/userController");
const { body } = require("express-validator");
const authenticateToken = require("../middleware/auth");

const router = express.Router();

router.post(
  "/register",
  [
    body("username")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters long"),
    body("email").isEmail().withMessage("Invalid email address"),
    body("password")
      .isLength({ min: 5 })
      .withMessage("Password must be at least 5 characters long"),
  ],
  register
);

router.post(
  "/login",
  [
    body("usernameOrEmail")
      .notEmpty()
      .withMessage("Username or email is required"),
    body("password")
      .isLength({ min: 5 })
      .withMessage("Password must be at least 5 characters long"),
  ],
  login
);

router.get("/chat", authenticateToken, getChat);

module.exports = router;
