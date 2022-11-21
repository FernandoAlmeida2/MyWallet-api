import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import dotenv from "dotenv";
import authRouters from "./routes/auth.routes.js";
import historyRouters from "./routes/history.routes.js";

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
const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Running in http://localhost: ${port}`);
});
