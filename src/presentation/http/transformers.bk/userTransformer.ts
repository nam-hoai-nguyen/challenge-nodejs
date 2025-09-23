// transformers/userTransformer.ts
import { transformer } from "../utils/transformer";
import UserModel  from "../infrastructure/db/sequelize/models/UserModel";

export const userListTransformer  = (user: UserModel) => {
    return transformer(user, ["id", "name", "email", "role", "createdAt", "updatedAt"]);
};
