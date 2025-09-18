import { Request, Response, NextFunction } from 'express';
import { BaseError } from '../../../shared/errors/BaseError';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
    if (err instanceof BaseError) {
        return res.status(err.status).json({
            success: false,
            error: {
                code: err.code,
                message: err.message,
                details: err.details ?? undefined
            }
        });
    }

    console.error('[UNHANDLED_ERROR]', err);
    return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: 'Internal server error' }
    });
}