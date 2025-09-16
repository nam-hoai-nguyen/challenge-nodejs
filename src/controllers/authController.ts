import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt";
import { successResponse, errorResponse } from "../utils/responseHandler";
import {userListTransformer} from "../transformers/userTransformer";
import { UniqueConstraintError } from "sequelize";

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body || {};
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword, role: "employee" });
        // tạo token
        const token = generateToken({ id: user.id, email: user.email });
         const data = {
             user: userListTransformer(user),
             access_token: token,
         }
        return successResponse(res, "Đăng ký thông tin user thành công", data,200);
    } catch (error: any) {
        if (error instanceof UniqueConstraintError) {
            return errorResponse(res, "Email đã tồn tại, vui lòng chọn email khác", 400, null);
        }
        return errorResponse(res, error.message, 500);
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) return errorResponse(res, "User not found", 404);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return errorResponse(res, "Invalid password", 401, null);

        const token = generateToken({ id: user.id, email: user.email });
        const data = {
            user: userListTransformer(user),
            access_token: token,
        }
        return successResponse(res, "Login successful", data,200);
    } catch (err: any) {
        return errorResponse(res, err.message, 500);
    }
};