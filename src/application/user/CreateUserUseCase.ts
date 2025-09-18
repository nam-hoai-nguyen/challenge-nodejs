import { IUserRepository } from '../../domain/user/IUserRepository';
import { User } from '../../domain/user/User';
import { ConflictError, ValidationError } from '../../shared/errors/BaseError';
import crypto from 'crypto';

interface Input {
    email: string;
    name: string;
}

export class CreateUserUseCase {
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
            id: crypto.randomUUID(),
            email: input.email,
            name: input.name
        });

        await this.repo.add(user);
        return user;
    }
}