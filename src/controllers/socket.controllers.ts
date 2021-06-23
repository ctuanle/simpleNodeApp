import { Server, Socket } from "socket.io";

import {MessageModel} from '../db/models/message.model';
import {AdminModel} from '../db/models/admin.model';

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
            // console.log('[Admin '+data.sid+' to User '+data.rid+'] :'+data.msg);
            await MessageModel.create({
                sid: data.sid,
                rid: data.rid,
                message: data.msg
            });
            socket.to(usSockets[data.rid]).emit('user:receive_msg', {...data});
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
            await MessageModel.create({
                sid: data.sid,
                rid: aid,
                message: data.msg
            });
            socket.to(adSocket).emit('admin:receive_msg', {...data})
        }
    });
}