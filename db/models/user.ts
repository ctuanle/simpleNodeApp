import {Model, DataTypes, Optional} from 'sequelize';
import {sequelize} from '.';

interface User {
    uid: number,
    username: string,
    password: string,
    email?: string
}

interface BasicUser extends Optional<User, 'uid'>{}

interface UserInstance extends Model<User, BasicUser> {}

export const User = sequelize.define<UserInstance>('User', {
    uid: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
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