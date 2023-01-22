const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const CONFIG = require("./../config/config");

const authRouter = express.Router();

const CreatorValidationMW = require("./../validators/creator.validation");

authRouter.post(
  "/signup",
  CreatorValidationMW,
  passport.authenticate("signup", { session: false }),
  async (req, res, next) => {
    const body = {
      _id: req.user._id,
      email: req.user.email,
      firstName: req.user.firstName,
    };
    const token = jwt.sign({ user: body }, CONFIG.SECRET_KEY, {
      expiresIn: "1h",
    });

    res.json({
      message: "Signup successful",
      user: req.user,
      token
    });
  }
);

authRouter.post("/login", async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
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
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
        };
        const token = jwt.sign({ user: body }, CONFIG.SECRET_KEY, {
          expiresIn: "1h",
        });

        return res.json({
          firstName: user.firstName,
          email: user.email,
          token,
        });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

module.exports = authRouter;