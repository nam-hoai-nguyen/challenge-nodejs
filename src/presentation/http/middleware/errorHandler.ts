import { Request, Response, NextFunction } from 'express';
import { BaseError } from '../../../shared/errors/BaseError';

export function errorHandler(
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
) {
    // Nếu là lỗi custom kế thừa BaseError
    if (err instanceof BaseError) {
        return res.status(err.status).json({
            status: err.status,
            data: null,
            message: err.message
        });
    }

    // Log chi tiết cho developer
    console.error('[UNHANDLED_ERROR]', err);

    // Fallback: lỗi không xác định
    return res.status(500).json({
        status: 500,
        data: err,
        message: 'Internal server error'
    });
}
