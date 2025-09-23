import { Request, Response, NextFunction } from 'express';
import { CreateUserUseCase } from '../../../application/user/CreateUserUseCase';
import { userToDTO } from '../mappers/userMapper';
import { successResponse } from '../../../shared/utils/responseHandler';

export class AuthControllerV2 {
  constructor(private readonly createUser: CreateUserUseCase) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.createUser.execute(req.body);
      return successResponse(res, 'User created successfully', userToDTO(user), 200);
    } catch (err) {
      next(err);
    }
  };
}
