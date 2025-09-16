import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { UniqueConstraintError } from "sequelize";

import User from "../models/User";
import { generateToken } from "../utils/jwt";
import { userListTransformer } from "../transformers/userTransformer";
import { successResponse, errorResponse } from "../utils/responseHandler";
import { t, detectLocale } from "../lib/i18n";

export async function register(req: Request, res: Response) {
    const locale = detectLocale(req);
    try {
        const { name, email, password } = req.body || {};
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "employee"
        });

        const token = generateToken({ id: user.id, email: user.email });

        return successResponse(
            res,
            t(locale, "auth.register.success"),
            {
                user: userListTransformer(user),
                access_token: token
            },
            200
        );
    } catch (err: any) {
        if (err instanceof UniqueConstraintError) {
            return errorResponse(
                res,
                t(locale, "auth.register.email_taken"),
                409
            );
        }
        return errorResponse(
            res,
            t(locale, "auth.error.internal"),
            500
        );
    }
}


export async function login(req: Request, res: Response) {
    const locale = detectLocale(req);
    try {
        const { email, password } = req.body || {};

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return errorResponse(
                res,
                t(locale, "auth.login.user_not_found"),
                404
            );
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return errorResponse(
                res,
                t(locale, "auth.login.invalid_credentials"),
                401
            );
        }

        const token = generateToken({ id: user.id, email: user.email });

        return successResponse(
            res,
            t(locale, "auth.login.success"),
            {
                user: userListTransformer(user),
                access_token: token
            },
            200
        );
    } catch (err: any) {
        return errorResponse(
            res,
            t(locale, "auth.error.internal"),
            500
        );
    }
}
