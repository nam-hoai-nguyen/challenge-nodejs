import { Router } from 'express';
import { InMemoryUserRepository } from '../../../infrastructure/repositories/inMemory/InMemoryUserRepository';
import { CreateUserUseCase } from '../../../application/user/CreateUserUseCase';
import { UserControllerV2 } from '../controllers/UserControllerV2';

const router = Router();

// Wiring tạm thời (sau này sẽ thay bằng DI hoặc container)
const userRepo = new InMemoryUserRepository();
const createUserUC = new CreateUserUseCase(userRepo);
const userController = new UserControllerV2(createUserUC);

router.post('/', userController.create);

export const userV2Routes = router;