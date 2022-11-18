import { signUp, signIn } from "../controllers/authController.js";
import { Router } from "express";
import { userValidation } from "../middlewares/userValidation.middleware.js";
import { loginValidation } from "../middlewares/loginValidation.middleware.js";

const router = Router();

router.post("/sign-up",userValidation, signUp);

router.post("/sign-in", loginValidation, signIn);

export default router;