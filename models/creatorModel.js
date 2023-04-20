const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const crypto = require("crypto");

// const BankDetailsSchema = new mongoose.Schema({
//   bankName: {
//     type: String,
//     // required: true,
//   },
//   accountNumber: {
//     type: String,
//     // required: true,
//   },
//   accountName: {
//     type: String,
//     // required: true,
//   },
// });

const CreatorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please enter first name"],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, "Please enter last name"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  // phoneNumber: {
  //   type: String,
  //   // required: true,
  //   // unique: true,
  //   default: null
  // },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minlength: 8,
    select: false
  },
  confirmPassword: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
    select: false,
  },
  // bankDetails: BankDetailsSchema,
  role: {
    type: String,
    enum: ["creator", "admin"],
    default: "creator",
  },
  status: {
    type: String, 
    enum: ["active", "non-active", "deactivated"],
    default: "active"
  }
});

CreatorSchema.pre("save", async function (next) {
  const user = this;
  const hash = await bcrypt.hash(this.password, 12);

  this.password = hash;

  this.confirmPassword = undefined;
  next();
});

CreatorSchema.methods.isValidPassword = async function (password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);

  return compare;
};

const Creator = mongoose.model("Creator", CreatorSchema);

module.exports = Creator;
