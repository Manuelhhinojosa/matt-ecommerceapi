// dependencies
// mongoose
const mongoose = require("mongoose");

// post schema
// post schema
// post schema
const postSchema = new mongoose.Schema(
  {
    reference: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    inStock: {
      type: Boolean,
      required: true,
      default: true,
    },
    added: {
      type: Boolean,
      required: true,
      default: false,
    },
    recentWork: {
      type: Boolean,
      required: true,
      default: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 150,
    },
    shortDesc: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    largeDesc: {
      type: String,
      required: true,
      trim: true,
    },
    media: {
      url: {
        type: String,
        required: true,
      },
      filename: String,
      mimetype: String,
      fileOriginalName: String,
    },
    cost: {
      type: Number,
      required: true,
      min: [1, "Cost must be at least 1"],
    },
    nationwideDelivery: {
      type: Number,
      required: true,
      min: [0, "National delivery cost cannot be negative"],
    },
    internationalDelivery: {
      type: Number,
      required: true,
      min: [0, "International delivery cost cannot be negative"],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        ret.id = ret._id;
      },
    },
  }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
