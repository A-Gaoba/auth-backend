// routes/userRoutes.js
const express = require("express");
const { register, login, getChat } = require("../controllers/userController");
const { body } = require("express-validator");
const authenticateToken = require("../middleware/auth");

const router = express.Router();

router.post(
  "/register",
  body("username").isLength({ min: 3 }),
  body("email").isEmail(),
  body("password").isLength({ min: 5 }),
  register
);

router.post(
  "/login",
  body("usernameOrEmail").notEmpty(),
  body("password").isLength({ min: 5 }),
  login
);

router.get("/chat", authenticateToken, getChat);

module.exports = router;
