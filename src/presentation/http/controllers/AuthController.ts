import { Request, Response, NextFunction } from 'express';
import { RegisterUserUseCase } from '../../../application/auth/RegisterUserUseCase';
import { userToDTO } from '../mappers/userMapper';
import { successResponse } from '../../../shared/utils/responseHandler';

export class AuthController {
  constructor(private readonly registerUser: RegisterUserUseCase) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.registerUser.execute(req.body);
      return successResponse(res, 'User created successfully', result, 200);
    } catch (err) {
      next(err);
    }
  };
}
