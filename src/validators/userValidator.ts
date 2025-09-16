import { body } from "express-validator";

/**
 * createUserValidator:
 *  - Chỉ rule ở level "input HTTP"
 *  - Không xử lý business phức tạp
 */
export const createUserValidator = [
    body("name")
        .trim()
        .notEmpty().withMessage("ERR_NAME_REQUIRED")
        .isLength({ min: 2, max: 100 }).withMessage("ERR_NAME_LEN")
        .matches(/^[\p{L}\p{N}\s'.-]+$/u).withMessage("ERR_NAME_CHARS"),

    body("email")
        .trim()
        .toLowerCase()
        .isEmail().withMessage("ERR_EMAIL_INVALID")
        .isLength({ min: 5, max: 160 }).withMessage("ERR_EMAIL_LEN")
        .custom(value => {
            const allow = ["gmail.com", "yahoo.com", "outlook.com", "example.com"];
            const domain = value.split("@")[1];
            if (!domain || !allow.includes(domain)) {
                throw new Error("ERR_EMAIL_DOMAIN");
            }
            return true;
        }),

    body("password")
        .isLength({ min: 8 }).withMessage("ERR_PW_LEN")
        .matches(/[A-Z]/).withMessage("ERR_PW_UPPER")
        .matches(/[a-z]/).withMessage("ERR_PW_LOWER")
        .matches(/\d/).withMessage("ERR_PW_DIGIT")
        .matches(/[!@#$%^&*(),.?\":{}|<>_\-+=]/).withMessage("ERR_PW_SYMBOL")
        .custom(v => {
            if (/\s/.test(v)) throw new Error("ERR_PW_SPACE");
            return true;
        }),

    body("role")
        .optional()
        .isIn(["admin", "employee"]).withMessage("ERR_ROLE_INVALID")
];

/**
 * updateUserValidator:
 *  - Cho phép partial update
 *  - Password optional
 */
export const updateUserValidator = [
    body("name")
        .optional()
        .trim()
        .notEmpty().withMessage("ERR_NAME_REQUIRED")
        .isLength({ min: 2, max: 100 }).withMessage("ERR_NAME_LEN")
        .matches(/^[\p{L}\p{N}\s'.-]+$/u).withMessage("ERR_NAME_CHARS"),

    body("email")
        .optional()
        .trim()
        .toLowerCase()
        .isEmail().withMessage("ERR_EMAIL_INVALID")
        .isLength({ min: 5, max: 160 }).withMessage("ERR_EMAIL_LEN")
        .custom(value => {
            const allow = ["gmail.com", "yahoo.com", "outlook.com", "example.com"];
            const domain = value.split("@")[1];
            if (!domain || !allow.includes(domain)) {
                throw new Error("ERR_EMAIL_DOMAIN");
            }
            return true;
        }),

    body("password")
        .optional()
        .isLength({ min: 8 }).withMessage("ERR_PW_LEN")
        .matches(/[A-Z]/).withMessage("ERR_PW_UPPER")
        .matches(/[a-z]/).withMessage("ERR_PW_LOWER")
        .matches(/\d/).withMessage("ERR_PW_DIGIT")
        .matches(/[!@#$%^&*(),.?\":{}|<>_\-+=]/).withMessage("ERR_PW_SYMBOL")
        .custom(v => {
            if (/\s/.test(v)) throw new Error("ERR_PW_SPACE");
            return true;
        }),

    body("role")
        .optional()
        .isIn(["admin", "employee"]).withMessage("ERR_ROLE_INVALID")
];