import { Request, Response, NextFunction } from 'express';
import { RegisterUserUseCase } from '../../../application/auth/RegisterUserUseCase';
import { LoginUserUseCase } from '../../../application/auth/LoginUserUseCase';
// import { userToDTO } from '../mappers/userMapper';
import { successResponse } from '../../../shared/utils/responseHandler';

export class AuthController {
  constructor(
    private readonly registerUser: RegisterUserUseCase,
    private readonly loginUser: LoginUserUseCase,
  ) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.registerUser.execute(req.body);
      return successResponse(res, 'User created successfully', result, 200);
    } catch (err) {
      next(err);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.loginUser.execute(req.body);
      return successResponse(res, 'Login successfully', result, 200);
    } catch (err) {
      next(err);
    }
  };
}
