const Joi = require("joi");

const CreatorSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  confirmPassword: Joi.string().required(),
  role: Joi.string()
  // phoneNumber: Joi.string(),
    // .regex(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/i)
    // .required(),
  // bankDetails: {
  //   bankName: Joi.string().min(2).max(50).optional(),
  //   accountNumber: Joi.string().min(2).max(50).optional(),
  //   accountName: Joi.string().min(2).max(50).optional(),
  // },

});
 
async function CreatorValidationMW(req, res, next) {
  const creatorPayLoad = req.body;

  try {
    await CreatorSchema.validateAsync(creatorPayLoad);
    next();
  } catch (error) {
    next(error.details[0].message);
  }
}

module.exports = CreatorValidationMW;
