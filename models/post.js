const mongoose = require("mongoose");

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
      required: false,
    },
    imgSrcHref: {
      type: String,
      required: true,
    },
    imgFileName: {
      type: String,
      required: true,
    },
    imgMimetype: {
      type: String,
      required: true,
    },
    fileOriginalName: {
      type: String,
      required: true,
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
