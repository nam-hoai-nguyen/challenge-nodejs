import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt";
import { successResponse, errorResponse } from "../utils/responseHandler";
import {userListTransformer} from "../transformers/userTransformer";

export const register = async (req: Request, res: Response) => {
    try {

        console.log("req.body =", req.body); // xem body có nhận không
        const { name, email, password } = req.body || {};
        if (!name || !email || !password) {
            return errorResponse(res, "Vui lòng điền đầy đủ thông tin", null, 400);
        }
        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword, role: "employee" });

        // tạo token
        const token = generateToken({ id: user.id, email: user.email });
        return successResponse(res, "Đăng ký thông tin user", token,200);
    } catch (error: any) {
        return errorResponse(res, error.message, 500);
    }
};

// Đây là bước số 5: login / verify password
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ success: false, message: "Invalid password" });

        const token = generateToken({ id: user.id, email: user.email });
        res.json({ success: true, data: { user, token }, message: "Login successful" });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};