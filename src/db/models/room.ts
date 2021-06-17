import {Model, DataTypes, Optional} from 'sequelize';
import {sequelize} from '.';

interface Room {
    rid: number,
    uid: number
}

interface BasicRoom extends Optional<Room, 'rid'>{}

interface RoomInstance extends Model<Room, BasicRoom> {}

export const Room = sequelize.define<RoomInstance>('Room', {
    rid: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    uid: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false
    }
},  {
    tableName: 'rooms'
}); 