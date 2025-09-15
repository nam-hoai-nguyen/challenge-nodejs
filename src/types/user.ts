export interface UserAttributes {
    id: number;
    name: string;
    email: string;
    password: string;
    role: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// Khi tạo mới user thì có thể bỏ qua id, role, createdAt, updatedAt
export type UserCreationAttributes = Omit<UserAttributes, "id" | "role" | "createdAt" | "updatedAt"> & {
    role?: string;
};
