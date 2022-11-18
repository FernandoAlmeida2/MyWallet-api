import { sessionsCollection } from "../index.js";

export async function tokenValidation(req, res, next){
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");
  if (!token) {
    return res
      .status(401)
      .send({ message: "token is required! (format: Bearer token)" });
  }
  try {
    const session = await sessionsCollection.findOne({ token });
    if (!session) {
      return res.status(401).send({ message: "Invalid token!" });
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
  next();
}
