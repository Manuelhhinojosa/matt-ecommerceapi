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
  const newPost = await new Post({
    reference: "refTest3",
    inStock: true,
    added: false,
    recentWork: true,
    title: "testTitle",
    shortDesc: "shortDescTest",
    largeDesc: "largeDescTest",
    imgSrcHref: "imgSrcHrefTest",
    imgFileName: "imgFileNameTest",
    imgMimetype: "imgMimetypeTest",
    fileOriginalName: "fileOriginalNameTest",
    cost: 1,
    nationwideDelivery: 1,
    internationalDelivery: 1,
  });

  // reference
  // added
  // largeDesc

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
