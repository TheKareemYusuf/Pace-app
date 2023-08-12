const Joi = require("joi");

const CreatorSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).when('$isNew', {
    is: true,
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  lastName: Joi.string().min(2).max(50).when('$isNew', {
    is: true,
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  email: Joi.string().email().when('$isNew', {
    is: true,
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  password: Joi.string().when('$isNew', {
    is: true,
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  confirmPassword: Joi.string().when('$isNew', {
    is: true,
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  role: Joi.string(),
  status: Joi.string(),
  creatorSubjectOfInterest: Joi.array().items(Joi.string())
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
