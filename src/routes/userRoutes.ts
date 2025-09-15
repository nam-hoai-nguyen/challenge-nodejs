// src/routes/userRoutes.ts
import { Router } from "express";
import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
} from "../controllers/userController";
import { createUserSchema } from "../validators/userValidator";
import { validate } from "../middlewares/validate";

const router = Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", validate(createUserSchema), createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router; // 👈 Xuất mặc định
