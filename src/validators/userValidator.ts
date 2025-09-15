// src/validators/userValidator.ts
import { body } from "express-validator";

export const createUserSchema = [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Email không hợp lệ"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password phải có ít nhất 6 ký tự"),
    body("role")
        .optional()
        .isIn(["admin", "employee"])
        .withMessage("Role phải là admin hoặc employee"),
];
