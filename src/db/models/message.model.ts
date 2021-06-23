import {Model, DataTypes, Optional} from 'sequelize';
import {sequelize} from '.';

interface MessageAttributes {
    mid: number,
    sid: string,
    rid: string,
    message: string
}

interface MessageCreationAttributes extends Optional<MessageAttributes, 'mid'>{}

interface MessageInstance extends Model<MessageAttributes, MessageCreationAttributes> {}

export const MessageModel = sequelize.define<MessageInstance>('Message', {
    mid: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    sid: {
        type: DataTypes.UUID,
        allowNull: false
    },
    rid: {
        type: DataTypes.UUID,
        allowNull: false
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false
    }
},  {
    tableName: 'messages'
}); 