import { Server, Socket } from "socket.io";

import {MessageModel} from '../db/models/message.model';
import { RoomModel } from "../db/models/room.model";
import {AdminModel} from '../db/models/admin.model';
import { UserModel } from "../db/models/user.model";

let adSocket:string;
const usSockets:{[key:string] : string} = {};
// TODO: gửi tới tất cả các socket có cùng uid thay vì chỉ 1

export const socketHandler = (io:Server, socket:Socket) => {
    if (socket.handshake.auth.aid) {
        adSocket = socket.id;
        //console.log('Admin ['+socket.handshake.auth.aid+'] connected!');
    }
    else if (socket.handshake.auth.uid) {
        usSockets[socket.handshake.auth.uid] = socket.id;
        //console.log('User ['+socket.handshake.auth.uid+'] connected!');
    }

    // socket.on('disconnect', () => {
    //     console.log('User ['+socket.id+'] disconnected!')
    // });

    socket.on('admin:send_msg', async (data) => {
        if (socket.handshake.auth.aid === data.sid) {
            
            //Check if is there already any room for this receiver (user)
            const isRoomExisted = await RoomModel.findOne({
                where: {uid : data.rid}
            });
            const user = await RoomModel.findOne({where: {uid: data.rid}});

            let roomId:number;

            if (user) {
                if (!isRoomExisted) {
                    const newRoom = await RoomModel.create({
                        aid: data.sid,
                        uid: data.rid,
                        username: user.getDataValue('username'),
                        lastMsg: data.msg,
                        read: false
                    });
                    roomId = newRoom.getDataValue('rid');
                }
                else {
                    roomId = isRoomExisted.getDataValue('rid');
                    //await RoomModel.update({lastMsg: data.msg, read: false}, {where: {rid: roomId}})
                }
    
                // Push a new message to DB
                await MessageModel.create({
                    sid: data.sid,
                    rid: data.rid,
                    message: data.msg,
                    roomId: roomId,
                    read: false
                });
                socket.to(usSockets[data.rid]).emit('user:receive_msg', {...data});
            }

            
        }
        
    });

    socket.on('user:send_msg', async (data) => {
        if (socket.handshake.auth.uid === data.sid) {
            // console.log('[User'+data.sid+' to Admin] :'+data.msg);
            const admin = await AdminModel.findAll({
                attributes: ['aid'],
                raw: true
            });
            //TODO : handle this after when having many admins
            const aid = admin[0].aid;

            // Check if is there already any room for this sender (user)
            const isRoomExisted = await RoomModel.findOne({
                where: {uid: data.sid}
            });

            const user = await UserModel.findOne({where: {uid: data.sid}});

            let roomId:number;
            if (user) {
                if (!isRoomExisted) {
                    const newRoom = await RoomModel.create({
                        aid: aid,
                        uid: data.sid,
                        username: user.getDataValue('username'),
                        lastMsg: data.msg,
                        read: false
                    });
                    roomId = newRoom.getDataValue('rid');
                }
                else {
                    roomId = isRoomExisted.getDataValue('rid');
                    await RoomModel.update({lastMsg: data.msg, read: false}, {where: {rid: roomId}})
                }
    
                await MessageModel.create({
                    sid: data.sid,
                    rid: aid,
                    message: data.msg,
                    roomId: roomId,
                    read: false
                });
                socket.to(adSocket).emit('admin:receive_msg', {...data})
            }
        }
    });
}