const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const app = express();
const { validateSignUpData } = require("./utils/validation");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { userAuth } = require("./middlewares/userAuth");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstName, lastName, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    await user.save();
    res.send("saved successfully");
  } catch (err) {
    res.status(400).send("ERR :" + err.message);
  }
});
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isValidPassword = await user.validatePassword(password);
    if (isValidPassword) {
      //create JWT Token
      const token = await user.getJWT();
      res.cookie("token", token);
      res.send("Login Successfully!!!");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("ERR :" + err.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERR :" + err.message);
  }
});
app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user.firstName + " sent connection request");
  } catch (err) {
    res.status(400).send("ERR :" + err.message);
  }
});
// app.get("/feed", async (req, res) => {
//   try {
//     const userData = await User.find({});
//     if (!userData) {
//     } else {
//       res.send(userData);
//     }
//   } catch (err) {
//     res.status(400).send("Something went wrong ");
//   }
// });
// app.delete("/user", async (req, res) => {
//   const userId = req.body.userId;
//   try {
//     const userData = await User.findOneAndDelete(userId);

//     res.send("user deleted successfully");
//   } catch (err) {
//     res.status(400).send("Something went wrong ");
//   }
// });
// app.patch("/user/:userId", async (req, res) => {
//   const userId = req.params?.userId;
//   const data = req.body;
//   console.log(userId);
//   try {
//     const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
//     const isUpdateAllowed = Object.keys(data).every((k) => {
//       return ALLOWED_UPDATES.includes(k);
//       // console.log(ALLOWED_UPDATES.includes(k), k);
//     });
//     if (!isUpdateAllowed) {
//       throw new Error("Update not allowed");
//     }
//     if (data?.skills?.length > 10) {
//       throw new Error("skills cannot be more than 10");
//     }
//     await User.findByIdAndUpdate({ _id: userId }, data, {
//       runValidators: true,
//     });
//     res.send("user is updated successfully");
//   } catch (err) {
//     res.status(400).send("feiled to update user data" + err.message);
//   }
// });
connectDB()
  .then(() => {
    console.log("Database Connection Established...");
    app.listen(3000, () => {
      console.log("server listening to 3000");
    });
  })
  .catch((err) => {
    console.log("Database Connection Failed...", err);
  });
