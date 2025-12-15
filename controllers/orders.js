// models
const Order = require("../models/order");
const Post = require("../models/post");

// error handlng
const errorResponse = require("../utils/errorResponse");

// functions
// functions
// functions

// welcome
// welcome
// welcome
const orders = (req, res) => {
  try {
    return res
      .status(200)
      .send("Matt Marotti's E-commerce API (Back End) orders routes");
  } catch (error) {
    return errorResponse(res, error, "Error connecting to the database");
  }
};

// see all orders
// see all orders
// see all orders
const allOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user").populate("products");

    return res.status(200).json(orders);
  } catch (error) {
    return errorResponse(res, error, "Error fetching orders");
  }
};

// create order
// create order
// create order
const createOrder = async (req, res) => {
  try {
    const data = req.body;

    const newOrder = new Order({
      user: data.user,
      products: data.products,
      status: "Processing",
      custInfoAtTimeOfPurchase: {
        name: data.custInfoAtTimeOfPurchase.name,
        lastname: data.custInfoAtTimeOfPurchase.lastname,
        email: data.custInfoAtTimeOfPurchase.email,
      },
      contactInfoAtTimeOfPurchase: data.contactInfoAtTimeOfPurchase,
      shippingInfoAtTimeOfPurchase: data.shippingInfoAtTimeOfPurchase,
      productsInfoAtTimeOfPurchase: data.productsInfoAtTimeOfPurchase,
    });

    const order = await newOrder.save();

    await Promise.all(
      order.products.map(async (productId) => {
        await Post.findByIdAndUpdate(productId, { $set: { inStock: false } });
      })
    );

    return res.status(200).json(order);
  } catch (error) {
    return errorResponse(res, error, "Error creating order");
  }
};

// update order status
// update order status
// update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { _id: id, status } = req.body;

    const editedOrder = await Order.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    ).populate("products");

    if (!editedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (status === "Cancelled") {
      const productIds = editedOrder.products.map((p) => p._id);

      await Post.updateMany(
        { _id: { $in: productIds } },
        { $set: { inStock: true } }
      );

      console.log(
        `Restocked ${productIds.length} products for cancelled order ${id}`
      );
    }

    return res.status(200).json(editedOrder);
  } catch (error) {
    return errorResponse(res, error, "Error updating order status");
  }
};

module.exports = {
  orders,
  allOrders,
  createOrder,
  updateOrderStatus,
};
