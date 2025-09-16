// src/controllers/userController.ts
import { Request, Response } from "express";
import User from "../models/User";   // ✅ import default đúng cách
import { successResponse, errorResponse } from "../utils/responseHandler";
import { getAllUsersService } from "../services/userService";



export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const pageNo = parseInt(req.query.pageNo as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;
        const { data, meta } = await getAllUsersService({ pageNo, pageSize });
        return successResponse(res, "Lấy danh sách users thành công",  { users: data, meta }, 200);
    } catch (error: any) {
        return errorResponse(res, error.message, 500);
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, data: user });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Lỗi khi lấy user", error: error.message });
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body;
        const user = await User.create({ name, email, password, role });
        res.status(201).json({ success: true, data: user });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Lỗi khi tạo user", error: error.message });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, email, password, role } = req.body;

        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        await user.update({ name, email, password, role });
        res.json({ success: true, data: user });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Lỗi khi cập nhật user", error: error.message });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);

        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        await user.destroy();
        res.json({ success: true, message: "User deleted" });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Lỗi khi xóa user", error: error.message });
    }
};
