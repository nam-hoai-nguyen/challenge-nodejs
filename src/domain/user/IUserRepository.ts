import { User } from './User';

export interface IUserRepository {
    findByEmail(email: string): Promise<User | null>;
    add(user: User): Promise<void>;
}