// @ts-ignore
import { IUserRepository } from '@domain/user/IUserRepository';
// @ts-ignore
import { User } from '@domain/user/User';

export class InMemoryUserRepository implements IUserRepository {
    private items: User[] = [];

    async findByEmail(email: string): Promise<User | null> {
        return this.items.find(u => u.toObject().email === email) || null;
    }

    async add(user: User): Promise<void> {
        this.items.push(user);
    }
}