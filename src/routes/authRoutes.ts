import { Router, Request, Response, NextFunction } from "express";
import { register, login } from "../controllers/authController";
import {validate} from "../middlewares/validate";
import { createUserValidator } from "../validators/userValidator";

const router = Router();

router.post("/register",validate(createUserValidator), register);
router.post("/login", login);

export default router;
