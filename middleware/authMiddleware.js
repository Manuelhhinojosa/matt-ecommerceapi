// dependencies
// JWT
const jwt = require("jsonwebtoken");

// Models
// user model
const User = require("../models/user");

// protect routes middleware with JWT Token
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.user.id).select("-password");
      next();
    } catch (error) {
      console.error("Token verification falied", error);
      res.status(401).json({ message: "Not authorized, token falied" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

//
// // protect routes middleware (make sure only admin can create products)
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as an admin" });
  }
};
module.exports = { protect, admin };
