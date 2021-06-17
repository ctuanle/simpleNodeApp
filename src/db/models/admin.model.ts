import {Model, DataTypes, Optional} from 'sequelize';
import {sequelize} from '.';

interface AdminAttributes {
    aid: number,
    username: string,
    password: string,
    email: string | null
}

interface AdminCreationAttributes extends Optional<AdminAttributes, 'aid'>{}

interface AdminInstance extends Model<AdminAttributes, AdminCreationAttributes>, AdminAttributes {}

export const AdminModel = sequelize.define<AdminInstance>('Admin', {
    aid: {
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
    tableName: 'admins'
});