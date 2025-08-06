var express = require("express");
var router = express.Router();
const postsController = require("../controllers/posts");

// middleware
const upload = require("../middleware/multer");

// posts routes : /posts
router.get("/", postsController.posts);
router.get("/allposts", postsController.allPosts);
router.post("/create", upload.single("media"), postsController.createPost);
router.get("/:id", postsController.onePost);

module.exports = router;
