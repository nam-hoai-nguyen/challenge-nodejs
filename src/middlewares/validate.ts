import { Request, Response, NextFunction } from "express";
import { validationResult, ValidationChain } from "express-validator";
import { t, Locale } from "../lib/i18nMessages";

export const validate =
    (validators: ValidationChain[]) =>
        async (req: Request, res: Response, next: NextFunction) => {
            await Promise.all(validators.map(v => v.run(req)));

            const result = validationResult(req);
            if (result.isEmpty()) return next();

            const locale = detectLocale(req);

            return res.status(400).json({
                status: 400,
                message: t(locale, "VALIDATION_FAILED"),
                locale,
                data: null,
                error: result.array().map(e => ({
                    field: e?.param,
                    code: e.msg,
                    message: t(locale, e.msg),
                    value: e?.value
                }))
            });
        };

function detectLocale(req: Request): Locale {
    const q = (req.query.lang || "").toString().toLowerCase();
    if (isLocale(q)) return q as Locale;

    const h = (req.headers["x-lang"] || "").toString().toLowerCase();
    if (isLocale(h)) return h as Locale;

    const accept = (req.headers["accept-language"] || "").toString().toLowerCase();
    if (accept) {
        const primary = accept.split(",")[0].split("-")[0].trim();
        if (isLocale(primary)) return primary as Locale;
    }
    return "en";
}

function isLocale(v: string): v is Locale {
    return ["vi", "ja", "en"].includes(v);
}

export default validate;