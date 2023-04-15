const Joi = require("joi");

const UserSchema = Joi.object({
  firstName: Joi.string().min(2).max(50),
  lastName: Joi.string().min(2).max(50),
  username: Joi.string().min(2).max(50).regex(/^[a-zA-Z]+[a-zA-Z0-9]*$/),
  email: Joi.string().email(),
  password: Joi.string().required(),
  confirmPassword: Joi.string().required(),
  role: Joi.string(),
  status: Joi.string(),
  phoneNumber: Joi.string().regex(/^\d{11}$/).required()
  // bankDetails: {
  //   bankName: Joi.string().min(2).max(50).optional(),
  //   accountNumber: Joi.string().min(2).max(50).optional(),
  //   accountName: Joi.string().min(2).max(50).optional(),
  // },

});
 
async function UserValidationMW(req, res, next) {
  const userPayLoad = req.body;

  try {
    await UserSchema.validateAsync(userPayLoad);
    next();
  } catch (error) {
    next(error.details[0].message);
  }
}

module.exports = UserValidationMW;