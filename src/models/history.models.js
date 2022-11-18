import Joi from "joi";

export const historySchema = Joi.object({
    amount: Joi.number().min(0).required(),
    description: Joi.string().min(12).required(),
    type: Joi.string().valid("income", "expense").required(),
  });