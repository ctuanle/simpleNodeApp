import * as jwt from "jsonwebtoken";
import { Server, Socket } from "socket.io";

import { MessageModel } from "../db/models/message.model";
import { RoomModel } from "../db/models/room.model";
import { UserModel } from "../db/models/user.model";

let adSocket: string;
const usSockets: { [key: string]: string } = {};
// TODO: gửi tới tất cả các socket có cùng uid thay vì chỉ 1

export const socketHandler = (io: Server, socket: Socket) => {
    if (socket.handshake.auth.role == "ADMIN") {
        adSocket = socket.id;
    } else if (socket.handshake.auth.role == "NORMAL_USER") {
        usSockets[socket.handshake.auth.uid] = socket.id;
    }

    socket.on("admin:send_msg", async (data) => {
        if (socket.handshake.auth.uid === data.sdid) {
            try {
                //verify the validation of given token
                jwt.verify(
                    socket.handshake.auth.token,
                    <jwt.Secret>process.env.TOKEN_SECRET_KEY
                );

                // Find the room with the given data
                const room = await RoomModel.findOne({
                    where: { rid: data.rid },
                });
                const user = await UserModel.findOne({
                    where: { uid: data.rcid },
                });
                if (room && user && room.get("aid") == data.sdid) {
                    await MessageModel.create({
                        sid: room.getDataValue("aid"),
                        rid: room.getDataValue("uid"),
                        message: data.msg,
                        roomId: room.getDataValue("rid"),
                        read: false,
                    });
                    await room.update({
                        lastMsg: data.msg,
                        read: false,
                    });
                    socket
                        .to(usSockets[data.rcid])
                        .emit("user:receive_msg", { ...data });
                }
            } catch (err) {
                console.log(err.name, err.message);
            }
        }
    });

    socket.on("user:send_msg", async (data) => {
        if (socket.handshake.auth.uid === data.sid) {
            // Find the room with given roomId
            const room = await RoomModel.findOne({
                where: { rid: data.roomId },
            });
            if (room && room.get("uid") === data.sid) {
                //update room status
                RoomModel.update(
                    { lastMsg: data.msg, read: false },
                    { where: { rid: room.get("rid") } }
                );

                await MessageModel.create({
                    sid: data.sid,
                    rid: room.getDataValue("aid"),
                    message: data.msg,
                    roomId: room.getDataValue("rid"),
                    read: false,
                });
                socket.to(adSocket).emit("admin:receive_msg", { ...data });
            }
        }
    });
};
