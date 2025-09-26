// import { Request, Response, NextFunction } from "express";
// import { validationResult, ValidationChain } from "express-validator";
// import { t, detectLocale } from "../lib/i18n";
//
// export const validate =
//     (validators: ValidationChain[]) =>
//         async (req: Request, res: Response, next: NextFunction) => {
//             await Promise.all(validators.map(v => v.run(req)));
//
//             const result = validationResult(req);
//             if (result.isEmpty()) return next();
//
//             const locale = detectLocale(req);
//
//             return res.status(400).json({
//                 status: 400,
//                 message: t(locale, "VALIDATION_FAILED"),
//                 locale,
//                 data: null,
//                 error: result.array().map(e => ({
//                     field: e?.path,
//                     code: e.msg,
//                     message: t(locale, e.msg),
//                     value: e?.value
//                 }))
//             });
//         };
//
// export default validate;