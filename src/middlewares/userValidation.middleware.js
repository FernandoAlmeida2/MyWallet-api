import { userSchema } from "../index.js";

export function userValidation(req, res, next) {
  const validation = userSchema.validate(user, { abortEarly: false });
  if (validation.error) {
    const errorsList = validation.error.details.map((detail) => detail.message);
    return res.status(422).send(errorsList);
  }
  next();
}
