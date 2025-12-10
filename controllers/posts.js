// models
// psot model
const Post = require("../models/post");

// error handlng
const errorResponse = require("../utils/errorResponse");

// functions
// functions
// functions

// welcome
// welcome
// welcome
const posts = async (req, res) => {
  try {
    return res
      .status(200)
      .send("Matt Marotti's E-commerce API (Back End) posts routes");
  } catch (error) {
    return errorResponse(res, error, "Error connecting to the database");
  }
};

// see all posts
// see all posts
// see all posts
const allPosts = async (req, res) => {
  try {
    const allPosts = await Post.find({});
    return res.status(200).json(allPosts);
  } catch (error) {
    return errorResponse(res, error, "Error fetching posts");
  }
};

// see one post
// see one post
// see one post
const onePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json(post);
  } catch (error) {
    return errorResponse(res, error, "Error fetching post");
  }
};

// Create post (new product)
// Create post (new product)
// Create post (new product)
const createPost = async (req, res) => {
  try {
    const data = req.body;

    // Ensure an image was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "An image file is required" });
    }

    const newPost = new Post({
      reference: data.reference,
      inStock: data.inStock,
      added: data.added,
      recentWork: data.recentWork,
      title: data.title,
      shortDesc: data.shortDesc,
      largeDesc: data.largeDesc,
      media: {
        url: req.file.path,
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        fileOriginalName: req.file.originalname,
      },
      cost: data.cost,
      nationwideDelivery: data.nationwideDelivery,
      internationalDelivery: data.internationalDelivery,
    });

    const createdPost = await newPost.save();

    return res.status(201).json(createdPost);
  } catch (error) {
    return errorResponse(res, error, "Error creating post");
  }
};

// delete one post by ID
// delete one post by ID
// delete one post by ID
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await post.deleteOne();

    return res.status(200).json({
      message: "Post deleted successfully",
      deletedPost: post,
    });
  } catch (error) {
    return errorResponse(res, error, "Error deleting post");
  }
};

// edit post from mongoDB
// edit post from mongoDB
// edit post from mongoDB
const editPost = async (req, res) => {
  try {
    const data = req.body;
    const id = data._id;

    // Validate required fields (optional but professional)
    if (
      !data.title ||
      !data.shortDesc ||
      !data.cost ||
      data.nationwideDelivery == null ||
      data.internationalDelivery == null
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Update the post
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        $set: {
          inStock: data.inStock,
          recentWork: data.recentWork,
          title: data.title,
          shortDesc: data.shortDesc,
          cost: data.cost,
          nationwideDelivery: data.nationwideDelivery,
          internationalDelivery: data.internationalDelivery,
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    return errorResponse(res, error, "Error editing post");
  }
};

module.exports = {
  posts,
  allPosts,
  onePost,
  createPost,
  deletePost,
  editPost,
};
