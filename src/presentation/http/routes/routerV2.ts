import { Router } from 'express';
// import { InMemoryUserRepository } from '../../../infrastructure/repositories/inMemory/InMemoryUserRepository';
import { SequelizeUserRepository } from '../../../infrastructure/repositories/sequelize/SequelizeUserRepository';
import { RegisterUserUseCase } from '../../../application/auth/RegisterUserUseCase';
import { CreateUserUseCase } from '../../../application/user/CreateUserUseCase';
import { UserControllerV2 } from '../controllers/UserControllerV2';
import { AuthControllerV2 } from '../controllers/AuthControllerV2';

const router = Router();

const userRepo = new SequelizeUserRepository();

const registerUserUC = new RegisterUserUseCase(userRepo);
const createUserUC = new CreateUserUseCase(userRepo);
const userController = new UserControllerV2(createUserUC);
router.post('/', userController.create);
const authController = new AuthControllerV2(registerUserUC);
router.post('/register', authController.register);

export const routerV2 = router;
