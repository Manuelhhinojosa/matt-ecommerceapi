// models
const User = require("../models/user");

// dependencies
const jwt = require("jsonwebtoken");

// welcome
const users = async (req, res) => {
  try {
    res.send("Matt Marotti's E-commerce API (Back End) users routes");
  } catch {
    (error) => {
      console.log("Error connecting to the database:", error);
      res.status(500).json({ message: "Error connecting to the database" });
    };
  }
};

// register user
const registerUser = async (req, res) => {
  const {
    name,
    lastname,
    email,
    password,
    role,
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
    role,
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
        { expiresIn: "40h" },
        (err, token) => {
          if (err) throw err;

          // response
          res.status(201).json({ user, token });
        }
      );
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Server Error");
    });
};

//
// user login
const userLogin = async (req, res) => {
  const { email, password } = req.body;
  await User.findOne({ email })
    .populate("orders")
    .exec()
    .then((user) => {
      if (!user)
        return res.status(400).json({ message: "Invalid credentials" });

      return user.matchPassword(password).then((isMatch) => {
        if (!isMatch)
          return res.status(400).json({ message: "Invalid credentials" });

        // JWT payload
        const payload = { user: { id: user._id, role: user.role } };

        // Sign and return the token with user data
        jwt.sign(
          payload,
          process.env.JWT_SECRET,
          { expiresIn: "40h" },
          (err, token) => {
            if (err) throw err;
            res.json({ user, token });
          }
        );
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Server Error");
    });
};

// get all users
const getAllUsers = async (req, res) => {
  await User.find({})
    .populate("orders")
    .exec()
    .then((response) => {
      const allUsers = response;
      res.status(200).json(allUsers);
    })
    .catch((error) => {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Error fetching posts" });
    });
};

// get one user
const getOneUser = async (req, res) => {
  const { id } = req.params;
  await User.findById(id)
    .then((response) => {
      const user = response;
      res.status(200).json(user);
    })
    .catch((error) => {
      console.error("Error fetching post:", error);
      res.status(500).json({ message: "Error fetching post" });
    });
};

// delete one User
const deleteUser = async (req, res) => {
  try {
    const data = req.body;
    const id = data._id;

    const userToDelete = await User.findById(id);
    if (!userToDelete) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the post from MongoDB
    const deletedUser = await User.findByIdAndDelete(id);
    console.log(deletedUser);
    res.status(200).json(deletedUser);
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Error deleting post" });
  }
};

// edit user
const editUser = async (req, res) => {
  const data = req.body;
  const id = data._id;

  await User.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        isActive: data.isActive,
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
};

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
      console.error("Error inactivating user:", error);
      res.status(500).json({ message: "Error inactivating user" });
    });
};

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
      console.error("Error reactivating user:", error);
      res.status(500).json({ message: "Error reactivating user" });
    });
};

module.exports = {
  users,
  registerUser,
  userLogin,
  getAllUsers,
  getOneUser,
  deleteUser,
  editUser,
  inactivateUser,
  reactivateUser,
};
