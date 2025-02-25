const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 15,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email Id");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Invalid Password");
        }
      },
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Gender data is not Valid");
        }
      },
    },
    photoUrl: {
      type: String,
      default: "https://www.pngkey.com/png/full/73-730434_04-dummy-avatar.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid PhotoUrl");
        }
      },
    },
    about: {
      type: String,
      default: "This is the default about ",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);
userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "DEV@tinder", {
    expiresIn: "7d",
  });
  return token;
};
userSchema.methods.validatePassword = async function (password) {
  const user = this;
  const passwordHash = user.password;

  const isValidPassword = await bcrypt.compare(password, passwordHash);
  return isValidPassword;
};
module.exports = mongoose.model("User", userSchema);
