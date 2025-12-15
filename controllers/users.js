// models
const User = require("../models/user");

// dependencies
const jwt = require("jsonwebtoken");

// error handlng
const errorResponse = require("../utils/errorResponse");

// functions
// functions
// functions

// welcome
// welcome
// welcome
const users = async (req, res) => {
  try {
    return res
      .status(200)
      .send("Matt Marotti's E-commerce API (Back End) users routes");
  } catch (error) {
    return errorResponse(res, error, "Error connecting to the database");
  }
};

// register user
// register user
// register user
const registerUser = async (req, res) => {
  try {
    const {
      name,
      lastname,
      email,
      password,
      contactPhoneNumber,
      contactAddress,
      contactUnit,
      contactCountry,
      contactProvinceOrState,
      contactCity,
      contactPostalCode,
      shippingSameAsContactInfo,
      shippingPhoneNumber,
      shippingAddress,
      shippingUnit,
      shippingCountry,
      shippingProvinceOrState,
      shippingCity,
      shippingPostalCode,
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({
      name,
      lastname,
      email,
      password,
      contactPhoneNumber,
      contactAddress,
      contactUnit,
      contactCountry,
      contactProvinceOrState,
      contactCity,
      contactPostalCode,
      shippingSameAsContactInfo,
      shippingPhoneNumber,
      shippingAddress,
      shippingUnit,
      shippingCountry,
      shippingProvinceOrState,
      shippingCity,
      shippingPostalCode,
    });

    const savedUser = await newUser.save();

    const payload = { user: { id: savedUser._id, role: savedUser.role } };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ user: savedUser, token });
      }
    );
  } catch (error) {
    return errorResponse(res, error, "Error creating user");
  }
};

// user login
// user login
// user login
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email })
      .select("+password")
      .populate({
        path: "orders",
        populate: { path: "products" },
      })
      .exec();

    if (!user) {
      return res.status(400).json({ message: "User not registered yet" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    user.password = undefined;

    const payload = {
      user: { id: user._id, role: user.role },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        return res.status(200).json({ user, token });
      }
    );
  } catch (error) {
    return errorResponse(res, error, "Error logging in user");
  }
};

// get all users
// get all users
// get all users
const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find({})
      .populate({
        path: "orders",
        populate: { path: "products" },
      })
      .exec();

    return res.status(200).json(allUsers);
  } catch (error) {
    return errorResponse(res, error, "Error fetching all users");
  }
};

// get logged in user
// get logged in user
// get logged in user
const getLoggedinUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(req.user);
  } catch (error) {
    return errorResponse(res, error, "Error retrieving logged-in user");
  }
};

// get one user
// get one user
// get one user
const getOneUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id)
      .populate({
        path: "orders",
        populate: { path: "products" },
      })
      .exec();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return errorResponse(res, error, "Error fetching user");
  }
};

// delete one User
// delete one User
// delete one User
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user && req.user._id.toString() === id) {
      return res
        .status(400)
        .json({ message: "You cannot delete your own account" });
    }

    const userToDelete = await User.findById(id).select("-password");
    if (!userToDelete) {
      return res.status(404).json({ message: "User not found" });
    }

    const deletedUser = await User.findByIdAndDelete(id).select("-password");

    return res.status(200).json({
      message: "User deleted successfully",
      user: deletedUser,
    });
  } catch (error) {
    return errorResponse(res, error, "Error deleting user");
  }
};

// edit user password
// edit user password
// edit user password
const editUserPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const { id } = req.params;

    // Basic validation
    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Both old and new passwords are required" });
    }

    // Get user with password field included
    const user = await User.findById(id).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate old password
    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Update password (hashed via schema middleware)
    user.password = newPassword;
    await user.save();

    // Do not send back the password / user object
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    errorResponse(res, error, "Error updating user password");
  }
};

// edit user contact info
// edit user contact info
// edit user contact info
const editContactUser = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const updateData = {
      contactPhoneNumber: data.contactPhoneNumber,
      contactAddress: data.contactAddress,
      contactUnit: data.contactUnit,
      contactCountry: data.contactCountry,
      contactProvinceOrState: data.contactProvinceOrState,
      contactCity: data.contactCity,
      contactPostalCode: data.contactPostalCode,
      shippingSameAsContactInfo: data.shippingSameAsContactInfo,
    };

    if (data.shippingSameAsContactInfo === true) {
      updateData.shippingPhoneNumber = data.shippingPhoneNumber;
      updateData.shippingAddress = data.shippingAddress;
      updateData.shippingUnit = data.shippingUnit;
      updateData.shippingCountry = data.shippingCountry;
      updateData.shippingProvinceOrState = data.shippingProvinceOrState;
      updateData.shippingCity = data.shippingCity;
      updateData.shippingPostalCode = data.shippingPostalCode;
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Contact information updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    errorResponse(res, error, "Error updating contact information");
  }
};

// edit user shipping info
// edit user shipping info
// edit user shipping info
const editShippingUser = async (req, res) => {
  try {
    const data = req.body;
    const { id } = req.params;

    const updateData = {
      shippingSameAsContactInfo: data.shippingSameAsContactInfo,
    };

    if (data.shippingSameAsContactInfo === true) {
      updateData.contactPhoneNumber = data.shippingPhoneNumber;
      updateData.contactAddress = data.shippingAddress;
      updateData.contactUnit = data.shippingUnit;
      updateData.contactCountry = data.shippingCountry;
      updateData.contactProvinceOrState = data.shippingProvinceOrState;
      updateData.contactCity = data.shippingCity;
      updateData.contactPostalCode = data.shippingPostalCode;
      updateData.shippingPhoneNumber = data.shippingPhoneNumber;
      updateData.shippingAddress = data.shippingAddress;
      updateData.shippingUnit = data.shippingUnit;
      updateData.shippingCountry = data.shippingCountry;
      updateData.shippingProvinceOrState = data.shippingProvinceOrState;
      updateData.shippingCity = data.shippingCity;
      updateData.shippingPostalCode = data.shippingPostalCode;
    } else {
      updateData.shippingPhoneNumber = data.shippingPhoneNumber;
      updateData.shippingAddress = data.shippingAddress;
      updateData.shippingUnit = data.shippingUnit;
      updateData.shippingCountry = data.shippingCountry;
      updateData.shippingProvinceOrState = data.shippingProvinceOrState;
      updateData.shippingCity = data.shippingCity;
      updateData.shippingPostalCode = data.shippingPostalCode;
    }

    const editedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!editedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message:
        data.shippingSameAsContactInfo === true
          ? "Contact info synced with shipping info"
          : "Shipping info updated",
      user: editedUser,
    });
  } catch (error) {
    errorResponse(res, error, "Error editing user's shipping info");
  }
};

// inactivate user
// inactivate user
// inactivate user
const inactivateUser = async (req, res) => {
  try {
    const { _id: id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: { isActive: false } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("result:", updatedUser);
    return res.status(200).json(updatedUser);
  } catch (error) {
    errorResponse(res, error, "Error inactivating user");
  }
};

// reactivate user
// reactivate user
// reactivate user
const reactivateUser = async (req, res) => {
  try {
    const { _id: id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: { isActive: true } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("result:", updatedUser);
    return res.status(200).json(updatedUser);
  } catch (error) {
    errorResponse(res, error, "Error reactivating user");
  }
};

module.exports = {
  users,
  registerUser,
  userLogin,
  getAllUsers,
  getLoggedinUser,
  getOneUser,
  deleteUser,
  editUserPassword,
  editContactUser,
  editShippingUser,
  inactivateUser,
  reactivateUser,
};
