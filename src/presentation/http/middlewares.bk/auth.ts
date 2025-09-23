// import { Request, Response, NextFunction } from "express";
// import { verifyToken } from "../utils/jwt";
//
// export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
//     const authHeader = req.headers.authorization;
//
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//         return res.status(401).json({ success: false, message: "Unauthorized" });
//     }
//
//     const token = authHeader.split(" ")[1];
//
//     try {
//         const decoded = verifyToken(token);
//         // @ts-ignore
//         req.user = decoded; // gán user info vào request
//         next();
//     } catch (err) {
//         return res.status(401).json({ success: false, message: "Invalid token" });
//     }
// };
