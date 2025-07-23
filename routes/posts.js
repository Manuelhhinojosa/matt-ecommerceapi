var express = require("express");
var router = express.Router();
const postsController = require("../controllers/posts");

// posts routes : /posts/
router.get("/", postsController.posts);
router.get("/allposts", postsController.allPosts);
router.get("/:id", postsController.onePost);
// change to get.post once form is completed
router.get("/create", postsController.createPost);

module.exports = router;
