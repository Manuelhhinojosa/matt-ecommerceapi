// mongoose
const mongoose = require("mongoose");

// Connect to MongoDB
const connectDB = async () => {
  try {
    if (!process.env.DATABASE_URL) {
      console.error("❌ DATABASE_URL is missing in .env file");
      process.exit(1);
    }

    const conn = await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✔️ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
