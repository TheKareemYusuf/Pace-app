const passport = require("passport");
const passportCustom = require("passport-custom");
const CONFIG = require('./../config/config')


const Creator = require("./../models/creatorModel");



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
  "signup",
  new passportCustom(async (req, next) => {
    try {
      const { email, firstName, lastName, password, confirmPassword, role } =
        req.body;
      const user = await Creator.create({
        email,
        firstName,
        lastName,
        password,
        confirmPassword,
        role
      }); 

      return next(null, user);
    } catch (error) {
      next(error);
    }
  })
);

passport.use(
  "login",
  new passportCustom(async (req, next) => {
    try {
      const { email, password } = req.body;
      const user = await Creator.findOne({ email });

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