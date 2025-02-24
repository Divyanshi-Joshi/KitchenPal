const mongoose = require("mongoose");

const MONGO_URI = "mongodb://127.0.0.1:27017/kitchen"; // Change "kitchen" if needed

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB successfully!"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

module.exports = mongoose;
