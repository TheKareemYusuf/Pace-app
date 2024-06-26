const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const CONFIG = require("./../config/config");
const UserValidationMW = require("./../validators/user.validation");
const userController = require("./../controllers/userController")

const authRouter = express.Router();


authRouter.post(
  "/signup",
  UserValidationMW,
  passport.authenticate("user-signup", { session: false }),
  async (req, res, next) => {
    const body = {
      _id: req.user._id,
      phoneNumber: req.user.phoneNumber,
      username: req.user.username,
    };
    const token = jwt.sign({ user: body }, CONFIG.SECRET_KEY, {
      expiresIn: "12h",
    });

    // Save the JWT in the session
    // req.session.token = token;
    // req.session.userId = _id;

    // Remove password from output
    req.user.password = undefined;

    res.json({
      message: "Signup successful",
      user: req.user,
      token,
    });
  }
);

authRouter.post("/login", async (req, res, next) => {
  passport.authenticate("user-login", async (err, user, info) => {
    try {
      if (err) {
        return next(err);
      }
      if (!user) {
        const error = new Error("Username or password is incorrect");
        return next(error);
      }

      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        const body = {
          _id: req.user._id,
          phoneNumber: req.user.phoneNumber,
          username: req.user.username,
        };
        const token = jwt.sign({ user: body }, CONFIG.SECRET_KEY, {
          expiresIn: "12h",
        });

        // Save the JWT in the session
        req.session.token = token;

        const profileComplete = user.isProfileComplete();


        return res.json({
          username: user.username,
          phoneNumber: user.phoneNumber,
          isProfileComplete: profileComplete,

          token,
        });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});



module.exports = authRouter;
