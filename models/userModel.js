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

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    // required: [true, "Please enter first name"],
    trim: true,
  },
  lastName: {
    type: String,
    // required: [true, "Please enter last name"],
    trim: true,
  },
  username: {
    type: String,
    // unique: true,
    // sparse: true,
    // required: [true, "username is compulsory"],
    // match: /^[a-zA-Z]+[a-zA-Z0-9]*$/,
    // The regex pattern ^[a-zA-Z]+[a-zA-Z0-9]*$ ensures that the username
    // starts with an alphabet, followed by alphanumeric characters (if any).
    // The + sign indicates one or more occurrences, and the * sign indicates
    // zero or more occurrences.
    trim: true, 
  },
  email: {
    type: String,
    // required: [true, "Please provide your email"],
    unique: true,
    sparse: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  phoneNumber: {
    type: String,
    required: function () {
      return this.isNew || this.isModified("password");
    },
    // required: [true, "Phone number is required"],
    match: /^\d{11}$/,
    unique: true,
  },

  password: {
    type: String,
    minlength: 8,
    select: false,
    required: function () {
      return this.isNew || this.isModified("password");
    },
  },
  confirmPassword: {
    type: String, 
    select: false,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
    required: function () {
      return this.isNew || this.isModified("password");
    },
  },
  // bankDetails: BankDetailsSchema,
  gender: {
    type: String,
    enum: ["male", "female"],
    // required: [true, "Please select your gender"],
    // default: "creator",
  }, 
  status: {
    type: String,
    enum: ["active", "non-active", "deactivated"],
    default: "active",
  },
  dateOfBirth: {
    type: Date,
    // required: true
  },
  levelOfStudy: {
    type: String,
  },
  department: {
    type: String,
    enum: ["arts", "sciences", "commercials"]
  },
  subjectOfInterest: {
    type: [
      { 
        type: String,
      },
    ],
    validate: {
      validator: function(arr) {
        return arr.length <= 4;
      },
      message: "Subject of interest array can contain at most 4 elements"
    },
    default: [],
  },
},
{timestamps: true}
);

UserSchema.pre("save", async function (next) {
  // const user = this;

  if (!this.isModified('password')) return next();

  const hash = await bcrypt.hash(this.password, 12);

  this.password = hash;

  this.confirmPassword = undefined;
  next();
});

UserSchema.methods.isValidPassword = async function (password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);

  return compare;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;


