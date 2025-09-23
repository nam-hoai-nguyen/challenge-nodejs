import { IUserRepository } from '../../../domain/user/IUserRepository';
import { User } from '../../../domain/user/User';
import  UserModel  from '../../db/sequelize/models/UserModel';

export class SequelizeUserRepository implements IUserRepository {

    async findByEmail(email: string): Promise<User | null> {
        const record = await UserModel.findOne({ where: { email } });
        if (!record) return null;

        return User.create({
            id: record.id,
            email: record.email,
            name: record.name,
            password: record.password,
            role: record.role,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
        });
    }


    async add(user: User): Promise<User> {
        return await UserModel.create({
            email: user.email,
            name: user.name,
            password: user.password,
        });
    }
}
