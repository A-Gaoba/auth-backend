// controllers/userController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // You can use other services
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;
  try {
    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    const verificationLink = `http://localhost:5000/api/verify-email?email=${encodeURIComponent(
      email
    )}`;
    await transporter.sendMail({
      from: '"Your App Name" <your-email@gmail.com>',
      to: email,
      subject: "Email Verification",
      text: `Please verify your email by clicking the link: ${verificationLink}`,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { usernameOrEmail, password } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, "secretkey", { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

exports.verifyEmail = async (req, res) => {
  const { email } = req.query;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    user.isVerified = true; // Mark user as verified
    await user.save();

    res.json({ message: "Email verified successfully! You can now log in." });
  } catch (error) {
    res.status(500).json({ message: "Error verifying email", error });
  }
};

exports.getChat = (req, res) => {
  res.json({ message: `Hello, user ${req.user.id}! Welcome to the chat.` });
};
