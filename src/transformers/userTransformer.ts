// src/transformers/userTransformer.ts
export const userTransformer = (user: any) => {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
    };
};

export const userListTransformer = (users: any[]) => {
    return users.map(userTransformer);
};
