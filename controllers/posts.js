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
    res.send("Matt Marotti's E-commerce API (Back End) posts routes");
  } catch {
    (error) => {
      errorResponse(res, error, "Error connecting to the database");
    };
  }
};

// see all posts
// see all posts
// see all posts
const allPosts = async (req, res) => {
  await Post.find({})
    .then((response) => {
      const allPosts = response;
      res.status(200).json(allPosts);
    })
    .catch((error) => {
      errorResponse(res, error, "Error fetching posts");
    });
};

// see one post
// see one post
// see one post
const onePost = async (req, res) => {
  const { id } = req.params;
  await Post.findById(id)
    .then((response) => {
      const post = response;
      res.status(200).json(post);
    })
    .catch((error) => {
      errorResponse(res, error, "Error fetching post");
    });
};

// Create post (new product)
// Create post (new product)
// Create post (new product)
const createPost = async (req, res) => {
  const data = req.body;
  const newPost = await new Post({
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

  newPost
    .save()
    .then((response) => {
      const post = response;
      res.status(200).json(post);
    })
    .catch((error) => {
      errorResponse(res, error, "Error creating post");
    });
};

// delete one post by ID
// delete one post by ID
// delete one post by ID
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const postToDelete = await Post.findById(id);
    if (!postToDelete) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Delete the post from MongoDB
    const deletedPost = await Post.findByIdAndDelete(id);
    console.log(deletedPost);
    res.status(200).json(deletedPost);
  } catch (error) {
    errorResponse(res, error, "Error deleting post");
  }
};

// edit post from mongoDB
// edit post from mongoDB
// edit post from mongoDB
const editPost = async (req, res) => {
  const data = req.body;
  const id = data._id;

  await Post.findOneAndUpdate(
    { _id: id },
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
    }
  )
    .then((result) => {
      const editedPost = result;
      console.log("result:", editedPost);
      res.status(200).json(editedPost);
    })
    .catch((error) => {
      errorResponse(res, error, "Error editing post");
    });
};

module.exports = {
  posts,
  allPosts,
  onePost,
  createPost,
  deletePost,
  editPost,
};
