// dependencies
const mongoose = require("mongoose");
// password recurity
const bcrypt = require("bcryptjs");

// User model
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/.+\@.+\..+/, "Please enter a valid email address."],
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    contactPhoneNumber: {
      type: String,
      required: false,
    },
    contactAddress: {
      type: String,
      required: false,
    },
    contactUnit: {
      type: String,
      required: false,
    },
    contacCountry: {
      type: String,
      required: false,
    },
    contactProvinceOrState: {
      type: String,
      required: false,
    },
    contactCity: {
      type: String,
      required: false,
    },
    contactPostalCode: {
      type: String,
      required: false,
    },
    shippingSameAsContactInfo: {
      type: Boolean,
      required: false,
    },
    shippingPhoneNumber: {
      type: String,
      required: false,
    },
    shippingAddress: {
      type: String,
      required: false,
    },
    shippingUnit: {
      type: String,
      required: false,
    },
    shippingCountry: {
      type: String,
      required: false,
    },
    shippingProvinceOrState: {
      type: String,
      required: false,
    },
    shippingCity: {
      type: String,
      required: false,
    },
    shippingPostalCode: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Password Hash middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match user entered password to hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
