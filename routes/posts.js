var express = require("express");
var router = express.Router();

// controllers (functions)
const postsController = require("../controllers/posts");

// middleware
// cloudinary
const upload = require("../middleware/multer");
// for protected routes
const { protect, admin } = require("../middleware/authMiddleware");

// posts routes : /posts
router.get("/", postsController.posts);
router.get("/allposts", postsController.allPosts);
router.get("/:id", postsController.onePost);
// you need to protect the following routes with auth middleware functions
router.post("/create", upload.single("media"), postsController.createPost);
router.delete("/:id", postsController.deletePost);
router.put("/:id", postsController.editPost);

module.exports = router;
