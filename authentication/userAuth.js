const passport = require("passport");
const passportCustom = require("passport-custom");
const CONFIG = require("./../config/config");
const AppError = require('./../utils/appError');

const User = require("./../models/userModel");

const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

passport.use(
  new JWTstrategy(
    {
      secretOrKey: CONFIG.SECRET_KEY,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (token, next) => {
      try {
        return next(null, token.user);
      } catch (error) {
        next(error);
      }
    }
  )
);

passport.use(
  "user-signup",
  new passportCustom(async (req, next) => {
    try {
      const { phoneNumber, username, password, confirmPassword } = req.body;

      // // Check if a user with the provided username exists
      // const existingUsernameUser = await User.findOne({ username });
      // if (existingUsernameUser) {
      //   return next(null, false, { message: "Username is already in use" });
      // }

      // // Check if a user with the provided phone number exists
      // const existingPhoneNumberUser = await User.findOne({ phoneNumber });
      // if (existingPhoneNumberUser) {
      //   return next(null, false, { message: "Phone number is already in use" });
      // }

      const user = await User.create({
        phoneNumber,
        username,
        password,
        confirmPassword,
      });

      return next(null, user);
    } catch (error) {
      next(error);
    }
  })
);

passport.use(
  "user-login",
  new passportCustom(async (req, next) => {
    try {
      const { phoneNumberOrUsername, password } = req.body;
      // const user = await User.findOne({ phoneNumber });
      const user = await User.findOne({
        $or: [{ phoneNumber: phoneNumberOrUsername }, { username: phoneNumberOrUsername }],
      }).select("+password");

      if (!user) {
        return next(null, false, { message: "User not found" });
      }

      const validate = await user.isValidPassword(password);

      if (!validate) {
        return next(null, false, { message: "Wrong Password" });
      }

      return next(null, user, { message: "Logged in Successfully" });
    } catch (error) {
      return next(error);
    }
  })
);
