import { usersCollection, sessionsCollection } from "../index.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

export async function signUp(req, res) {
  const user = req.body;
  try {
    delete user.repeat_password;
    await usersCollection.insertOne({
      ...user,
      password: bcrypt.hashSync(user.password, 10),
    });
    res.status(201).send({ message: "registration done!" });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function signIn(req, res) {
  const { email, password } = req.body;
  let token;
  try {
    const user = await usersCollection.findOne({ email });
    if (user && bcrypt.compareSync(password, user.password)) {
      const sessionExists = await sessionsCollection.findOne({userId: user._id});
      if(!sessionExists){
        token = uuidv4();
      } else{
        token = sessionExists.token;
      }
      await sessionsCollection.insertOne({
        userId: user._id,
        token,
      });
      res.status(202).send({
        message: "Login was successful!",
        user: { name: user.name, token },
      });
    } else {
      return res.status(404).send({ message: "email/password invalid!" });
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}
