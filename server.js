// server.js
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect("mongodb+srv://gaoba:gaoba123@cluster0.nthnq.mongodb.net/chatapp")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Basic route to check if the server is running
app.get("/", (req, res) => {
  res.send("<h1>Server is running!</h1>");
});

// Use user routes
app.use("/api", userRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
