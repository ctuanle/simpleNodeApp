import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from ".";

interface RoomAttributes {
    rid: number;
    aid: string;
    uid: string;
    username: string;
    lastMsg: string;
    read: boolean;
}

interface RoomCreationAttributes extends Optional<RoomAttributes, "rid"> {}

interface RoomInstance extends Model<RoomAttributes, RoomCreationAttributes> {}

export const RoomModel = sequelize.define<RoomInstance>(
    "Room",
    {
        rid: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        aid: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        uid: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        lastMsg: {
            type: DataTypes.STRING(1000),
            allowNull: true,
        },
        read: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    },
    {
        tableName: "rooms",
    }
);
