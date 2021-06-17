import {Model, DataTypes, Optional} from 'sequelize';
import {sequelize} from '.';

interface Message {
    mid: number,
    rid: number,
    suid: number,
    message: string
}

interface BasicMessage extends Optional<Message, 'mid'>{}

interface MessageInstance extends Model<Message, BasicMessage> {}

export const Message = sequelize.define<MessageInstance>('Message', {
    mid: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    rid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    suid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    message: {
        type: DataTypes.STRING,
        allowNull: true
    }
},  {
    tableName: 'messages'
}); 