import { postHistory, getHistory } from "../controllers/historyController.js";
import { Router } from "express";
import { newDataValidation } from "../middlewares/newDataValidation.middleware.js";
import { tokenValidation } from "../middlewares/tokenValidation.middleware.js";

const router = Router();

router.use(tokenValidation);

router.post("/history", newDataValidation, postHistory);

router.get("/history", getHistory);

export default router;