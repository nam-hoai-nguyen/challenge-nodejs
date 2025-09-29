import { IUserRepository } from '../../domain/user/IUserRepository';
import { ValidationError } from '../../shared/errors/BaseError';
import { BcryptService } from '../../infrastructure/security/BcryptService';
import { JwtService } from '../../infrastructure/security/JwtService';

interface Input {
  email: string;
  password: string;
}

export class LoginUserUseCase {
  constructor(private readonly repo: IUserRepository) {}

  async execute(input: Input) {
    if (!input.email || !input.password) {
      throw new ValidationError('Email or password invalid');
    }
    const user = await this.repo.findByEmail(input.email);
    if (!user) {
      throw new ValidationError('Email or password invalid');
    }
    const isMatch = await BcryptService.compare(input.password, user.password);
    if (!isMatch) {
      throw new ValidationError('Email or password invalid');
    }
    const token = JwtService.generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });
    return { user: user.toObject(), token: token };
  }
}
