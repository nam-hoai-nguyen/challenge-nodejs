import { Router } from 'express';
import { SequelizeUserRepository } from '../../../infrastructure/repositories/sequelize/SequelizeUserRepository';
import { RegisterUserUseCase } from '../../../application/auth/RegisterUserUseCase';
import { LoginUserUseCase } from '../../../application/auth/LoginUserUseCase';
import { AuthController } from '../controllers/AuthController';

const router = Router();
const userRepo = new SequelizeUserRepository();

const registerUserUC = new RegisterUserUseCase(userRepo);
const loginUserUC = new LoginUserUseCase(userRepo);
const authController = new AuthController(registerUserUC, loginUserUC);
router.post('/register', authController.register);
router.post('/login', authController.login);
export const authRoute = router;
