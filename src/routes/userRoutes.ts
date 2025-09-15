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
import { authMiddleware } from "../middlewares/auth";


const router = Router();

router.get("/", authMiddleware, getAllUsers); // chỉ user có token mới xem được
router.get("/:id", getUserById);
router.post("/", validate(createUserSchema), createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router; // 👈 Xuất mặc định
