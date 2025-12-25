// dependencies
var express = require("express");
var router = express.Router();

// controllers (functinos)
const ordersController = require("../controllers/orders");

// middleware
const { protect, admin } = require("../middleware/authMiddleware");

// orders routes: /orders
// orders routes: /orders
// orders routes: /orders

router.get("/", ordersController.orders);
router.get("/allorders", protect, admin, ordersController.allOrders);
router.patch(
  "/editorderstatus",
  protect,
  admin,
  ordersController.updateOrderStatus
);
router.post(
  "/create-checkout-session",
  protect,
  ordersController.createCheckoutSession
);

module.exports = router;
