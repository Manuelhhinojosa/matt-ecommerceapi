const Post = require("./models/post");
require("dotenv").config();
require("./config/database");

const postTest = new Post({
  reference: "refTest2",
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

postTest
  .save()
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.log(error);
  });
