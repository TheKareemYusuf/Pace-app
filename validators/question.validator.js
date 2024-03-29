const Joi = require("joi");

const QuestionSchema = Joi.object({
  question: Joi.string().min(5).trim().required(),
  questionImageUrl: Joi.string().optional(),
  questionImagePublicId: Joi.string().optional(),
  answerOptions: Joi.array().items(Joi.string()).required(),
  subject: Joi.string().max(225).required(),
  topic: Joi.string().required(),
  correctAnswer: Joi.string().required(),
  creatorName: Joi.string().min(5),
  creatorId: Joi.string(),
  state: Joi.string(),
  mode: Joi.string(),
});

async function QuestionValidationMW(req, res, next) {
  const questionPayLoad = req.body;

  try {
    await QuestionSchema.validateAsync(questionPayLoad);
    next();
  } catch (error) {
    next(error.details[0].message);
  }
}

module.exports = QuestionValidationMW;
