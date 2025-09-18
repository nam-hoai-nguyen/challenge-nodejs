// transformers/userTransformer.ts
import { transformer } from "../utils/transformer";
import User  from "../infrastructure/db/sequelize/models/User";

export const userListTransformer  = (user: User) => {
    return transformer(user, ["id", "name", "email", "role", "createdAt", "updatedAt"]);
};
