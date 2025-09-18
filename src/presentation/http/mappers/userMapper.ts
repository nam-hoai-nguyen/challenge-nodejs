import { User } from '../../../domain/user/User';

export function userToDTO(user: User) {
    const o = user.toObject();
    return {
        id: o.id,
        email: o.email,
        name: o.name,
        status: o.status
    };
}