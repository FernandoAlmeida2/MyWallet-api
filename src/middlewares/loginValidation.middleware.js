import { loginSchema } from "../models/users.models.js";

export function loginValidation(req, res, next) {
  const validation = loginSchema.validate(req.body, { abortEarly: false });
  if (validation.error) {
    const errorsList = validation.error.details.map((detail) => detail.message);
    return res.status(422).send(errorsList);
  }
  next();
}
