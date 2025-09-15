// src/middleware/validate.ts
import { Request, Response, NextFunction } from "express";

export const validate =
    (schema: any) => (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({
                status: 400,
                message: "Validation failed",
                data: null,
                error: error.details.map((err: any) => err.message),
            });
        }
        next();
    };
