import { historyCollection, sessionsCollection } from "../index.js";
import dayjs from "dayjs";

export async function postHistory(req, res) {
  try {
    await historyCollection.insertOne({
      ...req.body,
      userId: session.userId,
      date: dayjs().format("DD/MM"),
    });
    res.status(201).send({ message: "Your history has been updated!" });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function getHistory(req, res) {
  try {
    const { authorization } = req.headers;
    const token = authorization.replace("Bearer ", "");
    const session = await sessionsCollection.findOne({ token });
    const userHistory = await historyCollection
      .find({ userId: session.userId })
      .toArray();
    res.status(200).send(userHistory);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}
