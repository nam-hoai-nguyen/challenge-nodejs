import {IUserRepository} from '../../domain/user/IUserRepository';
import {User} from '../../domain/user/User';
import {ConflictError, ValidationError} from '../../shared/errors/BaseError';
import {BcryptService} from "../../infrastructure/security/BcryptService";
import {JwtService} from "../../infrastructure/security/JwtService";

interface Input {
    email: string;
    name: string;
    password: string;
}

export class RegisterUserUseCase {
    constructor(private readonly repo: IUserRepository) {
    }

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
            password: await BcryptService.hash(input.password),
        });

        const result = await this.repo.add(user);

        const token = JwtService.generateToken({
            id: result.id,
            email: result.email,
            name: result.name,
        });
        return {user: user.toObject(), token: token};
    }
}
