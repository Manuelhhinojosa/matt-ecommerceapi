var express = require("express");
var router = express.Router();

// controllers (functinos)
const ordersController = require("../controllers/orders");

// orders routes: /orders
router.get("/", ordersController.orders);
router.post("/create", ordersController.createOrder);
module.exports = router;
