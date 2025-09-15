// src/services/userService.ts
import User from "../models/User";

export const getAllUsersService = async () => {
    return await User.findAll();
};

export const createUserService = async (data: any) => {
    // Ví dụ: check email trùng
    const exists = await User.findOne({ where: { email: data.email } });
    if (exists) throw new Error("Email đã tồn tại");
    return await User.create(data);
};
