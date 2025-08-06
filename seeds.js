const Post = require("./models/post");
require("dotenv").config();
require("./config/database");

const postTest = new Post({
  reference: "refTest1",
  inStock: true,
  added: false,
  recentWork: true,
  title: "testTitle",
  shortDesc: "shortDescTest",
  largeDesc: "this is the large description test text",
  media: {
    url: "mediaURL",
    filename: "filename",
    mimetype: "mimetype",
    fileOriginalName: "originalnamemedia",
  },
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
