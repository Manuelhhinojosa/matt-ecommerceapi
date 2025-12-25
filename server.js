// express generator
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var methodOverride = require("method-override");

// env vars
require("dotenv").config();

// DB
const connectDB = require("./config/database");
connectDB();

// Stripe webhook body parser
const bodyParser = require("body-parser");

// cors
const cors = require("cors");

// Routes
var indexRouter = require("./routes/index");
var postsRouter = require("./routes/posts");
var usersRouter = require("./routes/users");
var ordersRouter = require("./routes/orders");

// Stripe webhook controller
const { stripeWebhook } = require("./controllers/orders");

// app var
var app = express();

app.post(
  "/orders/confirm",
  bodyParser.raw({ type: "application/json" }),
  stripeWebhook
);

// app config
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

// routes
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/posts", postsRouter);
app.use("/orders", ordersRouter);

// catch 404
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
  // res.status(err.status || 500);
  // res.render("error");
});

module.exports = app;
