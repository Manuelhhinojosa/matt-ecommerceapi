// models
const Order = require("../models/order");

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

// create order
const createOrder = async (req, res) => {
  const data = req.body;

  const newOrder = await new Order({
    user: data.user,
    products: data.products,
    amountPaid: data.amountPaid,
  });

  newOrder
    .save()
    .then((response) => {
      const order = response;
      res.status(200).json(order);
    })
    .catch((error) => {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Error creating order" });
    });
};

module.exports = {
  orders,
  createOrder,
};
