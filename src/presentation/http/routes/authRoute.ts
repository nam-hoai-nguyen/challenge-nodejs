import { Router } from 'express';
import { SequelizeUserRepository } from '../../../infrastructure/repositories/sequelize/SequelizeUserRepository';
import { RegisterUserUseCase } from '../../../application/auth/RegisterUserUseCase';
import { AuthController } from '../controllers/AuthController';

const router = Router();
const userRepo = new SequelizeUserRepository();

const registerUserUC = new RegisterUserUseCase(userRepo);
const authController = new AuthController(registerUserUC);
router.post('/register', authController.register);
export const authRoute = router;
