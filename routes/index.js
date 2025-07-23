var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", async function (req, res, next) {
  try {
    res.redirect(302, "/posts");
  } catch (error) {
    console.log("Error during redirect:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
