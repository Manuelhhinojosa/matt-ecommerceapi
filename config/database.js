const mongoose = require("mongoose");

// Connect to MongoDB
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("Atlas connection open");
  })
  .catch((err) => {
    console.log("Mongo connection error:", err.message);
    process.exit(1);
  });
