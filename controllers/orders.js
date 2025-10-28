// models
const Order = require("../models/order");
const Post = require("../models/post");

// welcome
const orders = (req, res) => {
  try {
    res.send("Matt Marotti's E-commerce API (Back End) orders routes");
  } catch {
    (error) => {
      console.log("Error connecting to the database:", error);
      res.status(500).json({ message: "Error connecting to the database" });
    };
  }
};

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
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Error fetching orders" });
    });
};

// create order
const createOrder = async (req, res) => {
  const data = req.body;

  const newOrder = await new Order({
    user: data.user,
    products: data.products,
    amountPaid: data.amountPaid,
    status: "Processing",
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
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Error creating order" });
    });
};

const updateOrderStatus = async (req, res) => {
  const data = req.body;
  const id = data._id;

  await Order.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        status: data.status,
      },
    }
  )
    .then((result) => {
      const editedOrder = result;
      console.log("result:", editedOrder);
      res.status(200).json(editedOrder);
    })
    .catch((error) => {
      console.error("Error editing order status:", error);
      res.status(500).json({ message: "Error editing order status" });
    });
};

module.exports = {
  orders,
  allOrders,
  createOrder,
  updateOrderStatus,
};
