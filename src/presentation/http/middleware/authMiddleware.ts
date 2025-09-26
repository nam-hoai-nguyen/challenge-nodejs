import { Request, Response, NextFunction } from "express";
import { JwtService } from "@infrastructure/security/JwtService";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ status: 401, data: null, message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    try {
        const payload = JwtService.verifyToken(token);
        (req as any).user = payload; // attach user vào request
        next();
    } catch (err) {
        return res.status(401).json({ status: 401, data: null, message: "Invalid or expired token" });
    }
}
