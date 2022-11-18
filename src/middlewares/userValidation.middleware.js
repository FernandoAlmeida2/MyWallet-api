import { userSchema } from "../models/users.models.js";
import { usersCollection } from "../index.js";

export async  function userValidation(req, res, next) {
  const user = req.body;
  const validation = userSchema.validate(user, { abortEarly: false });
  if (validation.error) {
    const errorsList = validation.error.details.map((detail) => detail.message);
    return res.status(422).send(errorsList);
  }
  try {
    const userExists = await usersCollection.findOne({
      $or: [{ name: user.name }, { email: user.email }],
    });
    if (userExists) {
      return res.status(409).send({ message: "This user already exists!" });
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
  next();
}
