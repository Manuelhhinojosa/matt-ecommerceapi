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
router.post(
  "/create",
  protect,
  admin,
  upload.single("media"),
  postsController.createPost
);
router.delete("/:id", protect, admin, postsController.deletePost);
router.put("/:id", protect, admin, postsController.editPost);

module.exports = router;
