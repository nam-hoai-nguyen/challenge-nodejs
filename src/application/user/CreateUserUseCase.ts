import {IUserRepository} from '../../domain/user/IUserRepository';
import {User} from '../../domain/user/User';
import {ConflictError, ValidationError} from '../../shared/errors/BaseError';
import {BcryptService} from '../../infrastructure/security/BcryptService';
import {JwtService} from "../../infrastructure/security/JwtService";

interface Input {
    email: string;
    name: string;
    password: string;
}

