// dependencies
// mongoose
const mongoose = require("mongoose");

// middleware
// password recurity
const bcrypt = require("bcryptjs");

// User schema
// User schema
// User schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    lastname: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/.+\@.+\..+/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
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
      default: "",
    },
    contactAddress: {
      type: String,
      default: "",
    },
    contactUnit: {
      type: String,
      default: "",
    },
    contactCountry: {
      type: String,
      default: "",
    },
    contactProvinceOrState: {
      type: String,
      default: "",
    },
    contactCity: {
      type: String,
      default: "",
    },
    contactPostalCode: {
      type: String,
      default: "",
    },
    shippingSameAsContactInfo: {
      type: Boolean,
      required: false,
      default: false,
    },
    shippingPhoneNumber: {
      type: String,
      default: "",
    },
    shippingAddress: {
      type: String,
      default: "",
    },
    shippingUnit: {
      type: String,
      default: "",
    },
    shippingCountry: {
      type: String,
      default: "",
    },
    shippingProvinceOrState: {
      type: String,
      default: "",
    },
    shippingCity: {
      type: String,
      default: "",
    },
    shippingPostalCode: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        delete ret.password;
      },
    },
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
