// compositionRoot.ts – nơi tạo 1 lần tất cả instance
// @ts-ignore
import { SequelizeUserRepository } from './infrastructure/repositories/sequelize/SequelizeUserRepository';
// @ts-ignore
import { RegisterUserUseCase } from './application/auth/RegisterUserUseCase';
// @ts-ignore
// import { AuthController } from './presentation/http/controllers/AuthController';
//
// // (Sau này thêm: User CRUD Use Cases, Controllers khác, etc.)
//
// // Repository (dùng chung)
// const userRepository = new SequelizeUserRepository();
//
// // Auth Use Cases
// const registerUserUseCase = new RegisterUserUseCase(userRepository);
// const loginUserUseCase = new LoginUserUseCase(userRepository);
//
// // Controllers
// export const authControllerV2 = new AuthController(registerUserUseCase, loginUserUseCase);