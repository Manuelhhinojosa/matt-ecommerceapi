var express = require("express");
var router = express.Router();

// controllers (functinos)
const ordersController = require("../controllers/orders");

// middleware
const { protect, admin } = require("../middleware/authMiddleware");

// orders routes: /orders
router.get("/", ordersController.orders);
router.get("/allorders", protect, admin, ordersController.allOrders);
router.post("/create", protect, ordersController.createOrder);
module.exports = router;
