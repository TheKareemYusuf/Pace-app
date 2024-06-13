const Joi = require("joi");

const SubjectSchema = Joi.object({
  subject: Joi.string().max(225).required(),
  department: Joi.string().max(225).required(),
});

// async function SubjectValidationMW(req, res, next) {
//     const subjectPayLoad = req.body;
  
//     try {
//       await SubjectSchema.validateAsync(subjectPayLoad);
//       next();
//     } catch (error) {
//       next(error.details[0].message);
//     }
//   }

  async function SubjectValidationMW(req, res, next) {
    const subjectPayLoad = req.body;
  
    try {
      const isNew = req.method === 'POST';
      await SubjectSchema.validateAsync(subjectPayLoad, { context: { isNew } });
      next();
    } catch (error) {
      // Check if it's a Joi validation error
      if (error.isJoi) {
        // Extract the error message and send it as a response
        // return res.status(400).json({ error: `${error.details[0].path} is invalid` });
        return next(new AppError(`${error.details[0].path} is invalid`, 400))
      } else {
        // If it's not a Joi validation error, pass it to the next middleware for general error handling
        next(error);
      }
    }
  }
  
  module.exports = SubjectValidationMW;