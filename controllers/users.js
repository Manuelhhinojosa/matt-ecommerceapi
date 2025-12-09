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
    res.send("Matt Marotti's E-commerce API (Back End) users routes");
  } catch {
    (error) => {
      errorResponse(res, error, "Error connecting to the database");
    };
  }
};

// register user
// register user
// register user
const registerUser = async (req, res) => {
  const {
    name,
    lastname,
    email,
    password,
    isActive,
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

  //   ir user is registered alredy
  let newUser = await User.findOne({ email });
  if (newUser) return res.status(400).json({ message: "User already exists" });

  //   creating new user
  newUser = new User({
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

  await newUser
    .save()
    .then((response) => {
      // user created var
      const user = response;

      // JWT payload
      const payload = { user: { id: user._id, role: user.role } };

      // sign and return the token along with user data
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
        (err, token) => {
          if (err) throw err;

          res.status(201).json({ user, token });
        }
      );
    })
    .catch((error) => {
      errorResponse(res, error, "Error creating user");
    });
};

// user login
// user login
// user login
const userLogin = async (req, res) => {
  const { email, password } = req.body;

  await User.findOne({ email })
    .select("+password")
    .populate({
      path: "orders",
      populate: { path: "products" },
    })
    .exec()
    .then(async (user) => {
      if (!user) {
        return res.status(400).json({ message: "User not registered yet" });
      }

      // Compare passwords
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      user.password = undefined;

      // JWT payload
      const payload = { user: { id: user._id, role: user.role } };

      // Create token
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
        (err, token) => {
          if (err) throw err;
          return res.json({ user, token });
        }
      );
    })
    .catch((error) => {
      errorResponse(res, error, "Error logging in user");
    });
};

// get all users
// get all users
// get all users
const getAllUsers = async (req, res) => {
  await User.find({})
    .populate({
      path: "orders",
      populate: { path: "products" },
    })
    .exec()
    .then((response) => {
      const allUsers = response;
      res.status(200).json(allUsers);
    })
    .catch((error) => {
      errorResponse(res, error, "Error fetching all users");
    });
};

// get logged in user
// get logged in user
// get logged in user
const getLoggedinUser = async (req, res) => {
  // here
  if (!req.user) res.status(500).json({ message: "Uset not found" });
  const user = req.user;
  res.status(200).json(user);
};

// get one user
// get one user
// get one user
const getOneUser = async (req, res) => {
  const { id } = req.params;
  await User.findById(id)
    .populate({
      path: "orders",
      populate: { path: "products" },
    })
    .exec()
    .then((response) => {
      const user = response;
      res.status(200).json(user);
    })
    .catch((error) => {
      errorResponse(res, error, "Error fetching user");
    });
};

// delete one User
// delete one User
// delete one User
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const userToDelete = await User.findById(id);
    if (!userToDelete) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the post from MongoDB
    const deletedUser = await User.findByIdAndDelete(id);
    console.log(deletedUser);
    res.status(200).json(deletedUser);
  } catch (error) {
    errorResponse(res, error, "Error deliting user");
  }
};

// edit user password
// edit user password
// edit user password
const editUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const { id } = req.params;

  const user = await User.findById(id).select("+password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isMatch = await user.matchPassword(oldPassword);
  if (!isMatch) {
    return res.status(400).json({ message: "Old password is incorrect" });
  }

  user.password = newPassword;
  await user
    .save()
    .then((result) => {
      const editedUser = result;
      console.log("result:", editedUser);
      res.status(200).json(editedUser);
    })
    .catch((error) => {
      errorResponse(res, error, "Error editing user's password");
    });
};

// edit user contact info
// edit user contact info
// edit user contact info
const editContactUser = async (req, res) => {
  const data = req.body;
  const { id } = req.params;

  if (data.shippingSameAsContactInfo === true) {
    await User.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          contactPhoneNumber: data.contactPhoneNumber,
          contactAddress: data.contactAddress,
          contactUnit: data.contactUnit,
          contactCountry: data.contactCountry,
          contactProvinceOrState: data.contactProvinceOrState,
          contactCity: data.contactCity,
          contactPostalCode: data.contactPostalCode,
          shippingSameAsContactInfo: data.shippingSameAsContactInfo,
          shippingPhoneNumber: data.shippingPhoneNumber,
          shippingAddress: data.shippingAddress,
          shippingUnit: data.shippingUnit,
          shippingCountry: data.shippingCountry,
          shippingProvinceOrState: data.shippingProvinceOrState,
          shippingCity: data.shippingCity,
          shippingPostalCode: data.shippingPostalCode,
        },
      }
    )
      .then((result) => {
        const editedUser = result;
        console.log("result:", editedUser);
        res.status(200).json(editedUser);
      })
      .catch((error) => {
        errorResponse(res, error, "Error editing contact user's info");
      });
  } else if (data.shippingSameAsContactInfo === false) {
    await User.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          contactPhoneNumber: data.contactPhoneNumber,
          contactAddress: data.contactAddress,
          contactUnit: data.contactUnit,
          contactCountry: data.contactCountry,
          contactProvinceOrState: data.contactProvinceOrState,
          contactCity: data.contactCity,
          contactPostalCode: data.contactPostalCode,
          shippingSameAsContactInfo: false,
        },
      }
    )
      .then((result) => {
        const editedUser = result;
        console.log("result:", editedUser);
        res.status(200).json(editedUser);
      })
      .catch((error) => {
        errorResponse(res, error, "Error editing user's contact info");
      });
  }
};

// edit user shipping info
// edit user shipping info
// edit user shipping info
const editShippingtUser = async (req, res) => {
  const data = req.body;
  const { id } = req.params;

  if (data.shippingSameAsContactInfo === true) {
    await User.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          contactPhoneNumber: data.contactPhoneNumber,
          contactAddress: data.contactAddress,
          contactUnit: data.contactUnit,
          contactCountry: data.contactCountry,
          contactProvinceOrState: data.contactProvinceOrState,
          contactCity: data.contactCity,
          contactPostalCode: data.contactPostalCode,
          shippingSameAsContactInfo: data.shippingSameAsContactInfo,
          shippingPhoneNumber: data.shippingPhoneNumber,
          shippingAddress: data.shippingAddress,
          shippingUnit: data.shippingUnit,
          shippingCountry: data.shippingCountry,
          shippingProvinceOrState: data.shippingProvinceOrState,
          shippingCity: data.shippingCity,
          shippingPostalCode: data.shippingPostalCode,
        },
      }
    )
      .then((result) => {
        const editedUser = result;
        console.log("result:", editedUser);
        res.status(200).json(editedUser);
      })
      .catch((error) => {
        console.error("Error editing post:", error);
        res.status(500).json({ message: "Error editing post" });
      });
  } else if (data.shippingSameAsContactInfo === false) {
    await User.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          shippingPhoneNumber: data.shippingPhoneNumber,
          shippingAddress: data.shippingAddress,
          shippingUnit: data.shippingUnit,
          shippingCountry: data.shippingCountry,
          shippingProvinceOrState: data.shippingProvinceOrState,
          shippingCity: data.shippingCity,
          shippingPostalCode: data.shippingPostalCode,
          shippingSameAsContactInfo: false,
        },
      }
    )
      .then((result) => {
        const editedUser = result;
        console.log("result:", editedUser);
        res.status(200).json(editedUser);
      })
      .catch((error) => {
        errorResponse(res, error, "Error editing user's shipping info");
      });
  }
};

// inactivate user
// inactivate user
// inactivate user
const inactivateUser = async (req, res) => {
  const data = req.body;
  const id = data._id;
  await User.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        isActive: false,
      },
    }
  )
    .then((result) => {
      const inactivatedUser = result;
      console.log("result:", inactivatedUser);
      res.status(200).json(inactivatedUser);
    })
    .catch((error) => {
      errorResponse(res, error, "Error inactivating user");
    });
};

// reactivate user
// reactivate user
// reactivate user
const reactivateUser = async (req, res) => {
  const data = req.body;
  const id = data._id;
  await User.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        isActive: true,
      },
    }
  )
    .then((result) => {
      const reactivatedUser = result;
      console.log("result:", reactivatedUser);
      res.status(200).json(reactivatedUser);
    })
    .catch((error) => {
      errorResponse(res, error, "Error reactivating user");
    });
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
  editShippingtUser,
  inactivateUser,
  reactivateUser,
};
