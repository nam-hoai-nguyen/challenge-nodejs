// src/models/User.ts
import { DataTypes, Model, Optional } from "sequelize";
// @ts-ignore
import sequelize from "../config/db";

// Định nghĩa interface cho các field trong bảng
export interface UserAttributes {
    id: number;
    name: string;
    email: string;
    password: string;
    role: string;
}

// Các field có thể bỏ qua khi tạo mới (id auto-increment, role default)
export type UserCreationAttributes = Optional<UserAttributes, "id" | "role">;

// Khai báo class Model
class User
    extends Model<UserAttributes, UserCreationAttributes>
    implements UserAttributes
{
    public id!: number;
    public name!: string;
    public email!: string;
    public password!: string;
    public role!: string;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

// Khởi tạo model
User.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "employee",
        },
    },
    {
        sequelize,
        modelName: "User",
        tableName: "users",
        timestamps: true,
    }
);

export default User;
