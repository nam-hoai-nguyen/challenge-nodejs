import { Router, Request, Response, NextFunction } from 'express';
import { ValidationError } from '../../../shared/errors/BaseError';

const router = Router();

// Cách 1: dùng next (an toàn nếu sau này bạn quen dùng wrapper async)
router.get('/cause-validation-error', (req: Request, res: Response, next: NextFunction) => {
    return next(new ValidationError('Demo invalid input'));
});

// (Hoặc) Cách 2: chỉ cần throw (Express sẽ chuyển xuống error handler cho handler sync)
router.get('/cause-validation-error-throw', (req: Request, res: Response) => {
    throw new ValidationError('Demo invalid input (throw)');
});

export const devTestRoute = router;