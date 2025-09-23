// src/utils/responseHandler.ts
import { Response } from "express";

interface ApiResponse {
    status: number; // HTTP status code
    data?: any;     // Dữ liệu trả về
    message?: string; // Thông điệp
}

export const sendResponse = (res: Response, { status, data, message }: ApiResponse) => {
    return res.status(status).json({
        status,
        data: data || null,
        message: message || "",
    });
};

/**
 * Trả về response thành công
 */
export const successResponse = (
    res: Response,
    message: string,
    data: any = null,
    status: number = 200
) => {
    return res.status(status).json({
        status,
        data,
        message,
    });
};

/**
 * Trả về response lỗi
 */
export const errorResponse = (
    res: Response,
    message: string,
    status: number = 500,
    data: any = null
) => {
    return res.status(status).json({
        status,
        data,
        message,
    });
};