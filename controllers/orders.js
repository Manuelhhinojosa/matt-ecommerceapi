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
    res.send("Matt Marotti's E-commerce API (Back End) orders routes");
  } catch {
    (error) => {
      errorResponse(res, error, "Error connecting to the database");
    };
  }
};

// see all orders
// see all orders
// see all orders
const allOrders = async (req, res) => {
  const orders = await Order.find({})
    .populate("user")
    .populate("products")
    .then((response) => {
      const allOrders = response;
      res.status(200).json(allOrders);
    })
    .catch((error) => {
      errorResponse(res, error, "Error fetching orders");
    });
};

// create order
// create order
// create order
const createOrder = async (req, res) => {
  const data = req.body;

  const newOrder = await new Order({
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

  newOrder
    .save()
    .then((response) => {
      const order = response;

      order.products.map(async (product) => {
        await Post.findOneAndUpdate(
          { _id: product },
          {
            $set: {
              inStock: false,
            },
          }
        );
      });

      res.status(200).json(order);
    })
    .catch((error) => {
      errorResponse(res, error, "Error creating order");
    });
};

// update order status
// update order status
// update order status
const updateOrderStatus = async (req, res) => {
  const data = req.body;
  const id = data._id;

  await Order.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        status: data.status,
      },
    },
    { new: true }
  )
    .populate("products")
    .then(async (result) => {
      const editedOrder = result;

      if (data.status === "Cancelled") {
        const productIds = editedOrder.products.map((p) => p._id);

        await Post.updateMany(
          { _id: { $in: productIds } },
          { $set: { inStock: true } }
        );

        console.log(
          `Restocked ${productIds.length} products for cancelled order ${id}`
        );
      }

      console.log("result:", editedOrder);
      res.status(200).json(editedOrder);
    })
    .catch((error) => {
      errorResponse(res, error, "Error updating order status");
    });
};

module.exports = {
  orders,
  allOrders,
  createOrder,
  updateOrderStatus,
};
