// models
const Post = require("../models/post");

const posts = async (req, res) => {
  try {
    res.send("Matt Marotti's E-commerce API (Back End)");
  } catch {
    (error) => {
      console.log("Error connecting to the database:", error);
      res.status(500).json({ message: "Error connecting to the database" });
    };
  }
};

// see all posts
const allPosts = async (req, res) => {
  await Post.find({})
    .then((response) => {
      const allPosts = response;
      res.status(200).json(allPosts);
    })
    .catch((error) => {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Error fetching posts" });
    });
};

// see one post
const onePost = async (req, res) => {
  const { id } = req.params;
  await Post.findById(id)
    .then((response) => {
      const post = response;
      res.status(200).json(post);
    })
    .catch((error) => {
      console.error("Error fetching post:", error);
      res.status(500).json({ message: "Error fetching post" });
    });
};
// Crate post (new product)
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
      console.error("Error creating post:", error);
      res.status(500).json({ message: "Error creating post" });
    });
};

module.exports = {
  posts,
  allPosts,
  onePost,
  createPost,
};
