import { Router } from 'express';
import { InMemoryUserRepository } from '../../../infrastructure/repositories/inMemory/InMemoryUserRepository';
import { CreateUserUseCase } from '../../../application/user/CreateUserUseCase';
import { UserControllerV2 } from '../controllers/UserControllerV2';
import { AuthControllerV2 } from '../controllers/AuthControllerV2';

const router = Router();

const userRepo = new InMemoryUserRepository();
const createUserUC = new CreateUserUseCase(userRepo);
const userController = new UserControllerV2(createUserUC);
router.post('/', userController.create);

const authController = new AuthControllerV2(createUserUC);
router.post("/register", authController.create);

export const routerV2 = router;