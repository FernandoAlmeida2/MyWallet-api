import { historySchema } from "../models/history.models.js";

export function newDataValidation(req, res, next) {
  const validation = historySchema.validate(req.body, { abortEarly: false });
  if (validation.error) {
    const errorsList = validation.error.details.map((detail) => detail.message);
    return res.status(422).send(errorsList);
  }
  next();
}
