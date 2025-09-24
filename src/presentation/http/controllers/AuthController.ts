import { Request, Response, NextFunction } from 'express';
import { CreateUserUseCase } from '../../../application/user/CreateUserUseCase';
import { userToDTO } from '../mappers/userMapper';
import { successResponse } from '../../../shared/utils/responseHandler';

export class AuthController {
  constructor(private readonly createUser: CreateUserUseCase) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('11111111111')
      const result = await this.createUser.execute(req.body);
      console.log('888888888888')
      return successResponse(res, 'User created successfully', result, 200);
    } catch (err) {
      console.log('9999999999999')
      next(err);
    }
  };
}
