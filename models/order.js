// dependencies
const mongoose = require("mongoose");

// Order model
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
      },
    ],
    status: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },
    custInfoAtTimeOfPurchase: {
      name: String,
      lastname: String,
      email: String,
    },
    contactInfoAtTimeOfPurchase: {
      type: String,
      required: true,
    },
    shippingInfoAtTimeOfPurchase: {
      type: String,
      required: true,
    },
    productsInfoAtTimeOfPurchase: [
      {
        imgUrl: String,
        title: String,
        cost: Number,
        shortDesc: String,
        deliveryCost: Number,
        totalAmountPaid: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
