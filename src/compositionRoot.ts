// compositionRoot.ts – nơi tạo 1 lần tất cả instance
// @ts-ignore
import { SequelizeUserRepository } from './infrastructure/repositories/sequelize/SequelizeUserRepository';
// @ts-ignore
import { RegisterUserUseCase } from './application/auth/RegisterUserUseCase';
// @ts-ignore
import { LoginUserUseCase } from './application/auth/LoginUserUseCase';
// @ts-ignore
import { AuthControllerV2 } from './presentation/http/controllers/AuthControllerV2';

// (Sau này thêm: User CRUD Use Cases, Controllers khác, etc.)

// Repository (dùng chung)
const userRepository = new SequelizeUserRepository();

// Auth Use Cases
const registerUserUseCase = new RegisterUserUseCase(userRepository);
const loginUserUseCase = new LoginUserUseCase(userRepository);

// Controllers
export const authControllerV2 = new AuthControllerV2(registerUserUseCase, loginUserUseCase);