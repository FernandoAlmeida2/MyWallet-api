import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import dotenv from "dotenv";
import Joi from "joi";
import bcrypt from "bcrypt";

const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]*$")).required(),
  repeat_password: Joi.ref("password"),
}).with('password', 'repeat_password');

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
  if(validation.error){
    const errorsList = validation.error.details.map((detail) => detail.message);
    return res.status(422).send(errorsList);
  }
  try{
    const userExists = await db.collection("users").findOne({$or:   [{name: user.name}, {email: user.email}]})
    if(userExists){
        return res.status(409).send({message: "This user already exists!"});
    }
    delete user.repeat_password;
    await db.collection("users").insertOne({...user, password: bcrypt.hashSync(user.password, 10)})
    res.status(201).send({message: "registration done!"})
  } catch(err){
    res.sendStatus(500);
  }
});

server.listen(5000, () => {
  console.log("Running in http://localhost:5000");
});
