import { IUserRepository } from '../../domain/user/IUserRepository';
import { User } from '../../domain/user/User';
import { ConflictError, ValidationError } from '../../shared/errors/BaseError';

interface Input {
  email: string;
  name: string;
  password: string;
}

export class RegisterUserUseCase {
  constructor(private readonly repo: IUserRepository) {}

  async execute(input: Input) {
    if (!input.email || !input.name) {
      throw new ValidationError('Missing email or name');
    }
    const existing = await this.repo.findByEmail(input.email);
    if (existing) {
      throw new ConflictError('Email already exists');
    }

    const user = User.create({
      email: input.email,
      name: input.name,
      password: input.password,
    });
    const response = await this.repo.add(user);
    return response;
  }
}
