import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from ".";

interface UserAttributes {
    uid: string;
    username: string;
    password: string;
    email: string;
    role: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, "uid"> {}

interface UserInstance
    extends Model<UserAttributes, UserCreationAttributes>,
        UserAttributes {}

export const UserModel = sequelize.define<UserInstance>(
    "User",
    {
        uid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        role: {
            type: DataTypes.ENUM,
            values: ["NORMAL_USER", "ADMIN"],
            defaultValue: "NORMAL_USER",
            allowNull: false,
        },
    },
    {
        tableName: "users",
    }
);
