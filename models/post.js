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
    },
    inStock: {
      type: Boolean,
      required: true,
    },
    added: {
      type: Boolean,
      required: true,
    },
    recentWork: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    shortDesc: {
      type: String,
      required: true,
    },
    largeDesc: {
      type: String,
      required: true,
    },
    media: {
      url: String,
      filename: String,
      mimetype: String,
      fileOriginalName: String,
    },
    cost: {
      type: Number,
      required: true,
    },
    nationwideDelivery: {
      type: Number,
      required: true,
    },
    internationalDelivery: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
