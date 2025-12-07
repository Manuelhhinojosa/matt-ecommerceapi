// dependencies
// mongoose
const mongoose = require("mongoose");

// middleware
// password recurity
const bcrypt = require("bcryptjs");

// User model
// User model
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
      default: "",
    },
    contactAddress: {
      type: String,
      required: false,
      default: "",
    },
    contactUnit: {
      type: String,
      required: false,
      default: "",
    },
    contactCountry: {
      type: String,
      required: false,
      default: "",
    },
    contactProvinceOrState: {
      type: String,
      required: false,
      default: "",
    },
    contactCity: {
      type: String,
      required: false,
      default: "",
    },
    contactPostalCode: {
      type: String,
      required: false,
      default: "",
    },
    shippingSameAsContactInfo: {
      type: Boolean,
      required: false,
    },
    shippingPhoneNumber: {
      type: String,
      required: false,
      default: "",
    },
    shippingAddress: {
      type: String,
      required: false,
      default: "",
    },
    shippingUnit: {
      type: String,
      required: false,
      default: "",
    },
    shippingCountry: {
      type: String,
      required: false,
      default: "",
    },
    shippingProvinceOrState: {
      type: String,
      required: false,
      default: "",
    },
    shippingCity: {
      type: String,
      required: false,
      default: "",
    },
    shippingPostalCode: {
      type: String,
      required: false,
      default: "",
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

// virtuals for user's orders
userSchema.virtual("orders", {
  ref: "Order",
  localField: "_id",
  foreignField: "user",
});

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
