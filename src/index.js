import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import dotenv from "dotenv";
import Joi from "joi";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

//Schemas
const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]*$")).required(),
  repeat_password: Joi.ref("password"),
}).with("password", "repeat_password");

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]*$")).required(),
});

//configs
const server = express();
dotenv.config();
server.use(cors());
server.use(express.json());
const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

try {
  await mongoClient.connect();
  db = mongoClient.db("MyWallet");
  //await db.collection('users').deleteMany({})
} catch (err) {
  console.log(err);
}

server.post("/sign-up", async (req, res) => {
  const user = req.body;
  const validation = userSchema.validate(user, { abortEarly: false });
  if (validation.error) {
    const errorsList = validation.error.details.map((detail) => detail.message);
    return res.status(422).send(errorsList);
  }
  try {
    const userExists = await db
      .collection("users")
      .findOne({ $or: [{ name: user.name }, { email: user.email }] });
    if (userExists) {
      return res.status(409).send({ message: "This user already exists!" });
    }
    delete user.repeat_password;
    await db
      .collection("users")
      .insertOne({ ...user, password: bcrypt.hashSync(user.password, 10) });
    res.status(201).send({ message: "registration done!" });
  } catch (err) {
    res.sendStatus(500);
  }
});

server.post("/sign-in", async (req, res) => {
  const { email, password } = req.body;
  const validation = loginSchema.validate(req.body, { abortEarly: false });
  if (validation.error) {
    const errorsList = validation.error.details.map((detail) => detail.message);
    return res.status(422).send(errorsList);
  }
  try {
    const user = await db.collection("users").findOne({ email });
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = uuidv4();
      await db.collection("sessions").insertOne({
        userId: user._id,
        token,
      });
      res.status(202).send({message: "Login was successful!", token})
    } else {
      return res.status(404).send({ message: "email/password invalid!" });
    }
  } catch (err) {
    res.sendStatus(500);
  }
});

server.listen(5000, () => {
  console.log("Running in http://localhost:5000");
});
