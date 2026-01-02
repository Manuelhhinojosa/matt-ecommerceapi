// dependencies
// mongoose
const mongoose = require("mongoose");

// Order schema
// Order schema
// Order schema
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
    stripeSessionId: {
      type: String,
      required: true,
      index: true,
    },
    custInfoAtTimeOfPurchase: {
      name: { type: String, required: true },
      lastname: { type: String, required: true },
      email: {
        type: String,
        required: true,
        match: [/.+\@.+\..+/, "Please provide a valid email"],
      },
    },
    contactInfoAtTimeOfPurchase: {
      type: String,
      required: true,
      trim: true,
    },
    shippingInfoAtTimeOfPurchase: {
      type: String,
      required: true,
      trim: true,
    },
    productsInfoAtTimeOfPurchase: [
      {
        imgUrl: { type: String, required: true },
        title: { type: String, required: true },
        cost: { type: Number, required: true, min: 0 },
        shortDesc: { type: String, required: true },
        deliveryCost: { type: Number, required: true, min: 0 },
        totalAmountPaid: { type: Number, required: true, min: 0 },
      },
    ],
  },
  {
    timestamps: true,
  }
);

orderSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
});

module.exports = mongoose.model("Order", orderSchema);

// ++++++++++++++++++++++++++++

// const mongoose = require("mongoose");

// const orderSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     products: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Post",
//         required: true,
//       },
//     ],
//     status: {
//       type: String,
//       enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
//       default: "Processing",
//     },
//     custInfoAtTimeOfPurchase: {
//       name: String,
//       lastname: String,
//       email: String,
//     },
//     contactInfoAtTimeOfPurchase: {
//       type: String,
//       required: true,
//     },
//     shippingInfoAtTimeOfPurchase: {
//       type: String,
//       required: true,
//     },
//     productsInfoAtTimeOfPurchase: [
//       {
//         imgUrl: String,
//         title: String,
//         cost: Number,
//         shortDesc: String,
//         deliveryCost: Number,
//         totalAmountPaid: Number,
//       },
//     ],
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model("Order", orderSchema);
