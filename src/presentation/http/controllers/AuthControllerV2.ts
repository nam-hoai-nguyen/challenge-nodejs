import { Request, Response, NextFunction } from 'express';
import { CreateUserUseCase } from '../../../application/user/CreateUserUseCase';
import { userToDTO } from '../mappers/userMapper';

export class AuthControllerV2 {
    constructor(private readonly createUser: CreateUserUseCase) {}

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await this.createUser.execute(req.body);
            res.status(201).json({ success: true, data: userToDTO(user) });
        } catch (err) {
            console.log(err)
            next(err);
        }
    };
}