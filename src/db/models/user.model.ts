import {Model, DataTypes, Optional} from 'sequelize';
import {sequelize} from '.';

interface UserAttributes {
    uid: string,
    username: string,
    password: string,
    email: string | null
}

interface UserCreationAttributes extends Optional<UserAttributes, 'uid'>{}

interface AdminInstance extends Model<UserAttributes, UserCreationAttributes>, UserAttributes {}

export const UserModel = sequelize.define<AdminInstance>('User', {
    uid: {
        type: DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    }
},  {
    tableName: 'users'
});