import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import dotenv from "dotenv";
import Joi from "joi";
import authRouters from "./routes/auth.routes.js";
import historyRouters from "./routes/history.routes.js";

//Schemas
export const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]*$")).required(),
  repeat_password: Joi.ref("password"),
}).with("password", "repeat_password");

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]*$")).required(),
});

export const historySchema = Joi.object({
  amount: Joi.number().min(0).required(),
  description: Joi.string().min(12).required(),
  type: Joi.string().valid("income", "expense").required(),
});

//configs
const server = express();
dotenv.config();
server.use(cors());
server.use(express.json());
server.use(authRouters);
server.use(historyRouters);
const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

try {
  await mongoClient.connect();
  db = mongoClient.db("MyWallet");
} catch (err) {
  console.log(err);
}
export const usersCollection = db.collection("users");
export const sessionsCollection = db.collection("sessions");
export const historyCollection = db.collection("history");

server.listen(5000, () => {
  console.log("Running in http://localhost:5000");
});
