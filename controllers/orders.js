// models
const Order = require("../models/order");
const Post = require("../models/post");
const User = require("../models/user");

// dependencies
// stripe
const stripe = require("../config/stripe");

// resend
const orderConfirmationEmail = require("../utils/orderConfirmation");
const orderConfirmationEmailAdmin = require("../utils/orderConfirmationAdmin");
const orderStatusUpdate = require("../utils/orderStatusUpdate");

// error handlng
const errorResponse = require("../utils/errorResponse");

// functions
// functions
// functions

// helper functions
// calculate taxe rate
// calculate taxe rate
// calculate taxe rate
const calculateTaxRate = (country) => {
  if (!country) return 0;

  if (country.toLowerCase() === "canada") {
    return 0.13;
  } else {
    return 0.13;
  }
};

// controller functions
//
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

// update order status
// update order status
// update order status
const updateOrderStatus = async (req, res) => {
  try {
    // get state
    const { _id: id, status } = req.body;

    // edit order
    const editedOrder = await Order.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    ).populate("products");

    if (!editedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    // if order status is cancelled re-stock products
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

    // send update email to user
    const user = await User.findById(editedOrder.user);
    await orderStatusUpdate(editedOrder, user);

    return res.status(200).json(editedOrder);
  } catch (error) {
    return errorResponse(res, error, "Error updating order status");
  }
};

// create checkout session (stripe)
// create checkout session (stripe)
// create checkout session (stripe)
const createCheckoutSession = async (req, res) => {
  try {
    const { products, userId, shippingSameAsContactInfo, deliveryFee } =
      req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "No products provided" });
    }

    // Fetch products
    const posts = await Post.find({ _id: { $in: products } });

    if (!posts || posts.length !== products.length) {
      return res.status(404).json({ message: "Some products not found" });
    }

    // Fetch user (for tax calculation)
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Build Stripe line items
    const lineItems = posts.map((post) => ({
      price_data: {
        currency: "cad",
        product_data: {
          name: post.title,
          description: post.shortDesc,
          images: post.media?.url ? [post.media.url] : [],
        },
        unit_amount: Math.round(post.cost * 100),
      },
      quantity: 1,
    }));

    // Subtotal (products only)
    const productsSubtotal = posts.reduce((sum, post) => sum + post.cost, 0);

    // Calculate tax
    const taxRate = calculateTaxRate(user.shippingCountry);
    const taxAmount = productsSubtotal * taxRate;

    // Add tax item
    if (taxAmount > 0) {
      lineItems.push({
        price_data: {
          currency: "cad",
          product_data: {
            name: "Tax",
          },
          unit_amount: Math.round(taxAmount * 100),
        },
        quantity: 1,
      });
    }

    // Add delivery item
    if (deliveryFee > 0) {
      lineItems.push({
        price_data: {
          currency: "cad",
          product_data: {
            name: "Delivery fee",
          },
          unit_amount: Math.round(deliveryFee * 100),
        },
        quantity: 1,
      });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      metadata: {
        userId,
        productIds: JSON.stringify(products),
        deliveryFee,
        taxAmount,
        shippingSameAsContactInfo: String(shippingSameAsContactInfo),
      },
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    res.status(500).json({ message: "Error creating checkout session" });
  }
};

// create order
// create order
// create order
const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // PAYMENT SUCCESS
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      const userId = session.metadata.userId;
      const productIds = JSON.parse(session.metadata.productIds);
      const deliveryFee = Number(session.metadata.deliveryFee);
      const taxAmount = Number(session.metadata.taxAmount);

      const user = await User.findById(userId);
      const posts = await Post.find({ _id: { $in: productIds } });

      if (!user || posts.length === 0) {
        throw new Error("User or products not found");
      }

      // Snapshot product info
      const productsInfoAtTimeOfPurchase = posts.map((post) => ({
        imgUrl: post.media.url,
        title: post.title,
        cost: post.cost,
        shortDesc: post.shortDesc,
        deliveryCost: deliveryFee,
        totalAmountPaid: session.amount_total / 100,
      }));

      // Create order
      const order = await Order.create({
        user: user._id,
        products: productIds,
        status: "Processing",
        stripeSessionId: session.id,
        custInfoAtTimeOfPurchase: {
          name: user.name,
          lastname: user.lastname,
          email: user.email,
        },
        contactInfoAtTimeOfPurchase: `Phone: ${user.contactPhoneNumber}. Address: ${user.contactAddress}, Unit: ${user.contactUnit}. Country: ${user.contactCountry}. Province or state: ${user.contactProvinceOrState}, City: ${user.contactCity}. Postal code: ${user.contactPostalCode}`,
        shippingInfoAtTimeOfPurchase: `Phone: ${user.shippingPhoneNumber}. Address: ${user.shippingAddress}, Unit: ${user.shippingUnit}. Country: ${user.shippingCountry}. Province or state: ${user.shippingProvinceOrState}, City: ${user.shippingCity}. Postal code: ${user.shippingPostalCode}`,
        productsInfoAtTimeOfPurchase,
      });

      // Mark products out of stock
      await Post.updateMany(
        { _id: { $in: productIds } },
        { $set: { inStock: false } }
      );

      // send confirmation email to client
      await orderConfirmationEmail(order, user);
      // send confirmation email to admin
      await orderConfirmationEmailAdmin(order, user);

      console.log("Order created and confirmation email sent:", order._id);
    } catch (error) {
      console.error("Order creation failed:", error);
      return res.status(500).json({ message: "Order processing failed" });
    }
  }

  res.status(200).json({ received: true });
};

// get order by session ID
const getOrderBySession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const order = await Order.findOne({ stripeSessionId: sessionId })
      .populate("products")
      .populate("user");

    if (!order) {
      return res.status(404).json({ message: "Order not found yet" });
    }

    res.status(200).json(order);
  } catch (error) {
    return errorResponse(res, error, "Error fetching order");
  }
};

module.exports = {
  orders,
  allOrders,
  updateOrderStatus,
  createCheckoutSession,
  stripeWebhook,
  getOrderBySession,
};
