import {Request, Response} from 'express';
import {Message} from '../db/models/message';
import {Room} from '../db/models/room';

export const getMessageByRoom = async (req: Request, res: Response) => {
    try {
        const messages = await Message.findAll({where: {rid : req.params.rid}, raw:true});
        if (messages.length > 0) {
            res.status(200).send({data: messages});
        }
        else {
            res.status(404).send({data: null});
        }
    }
    catch (err) {
        res.status(500).send({'message': err.message});
    }
}

export const getMessageById = async (req: Request, res: Response) => {
    try {
        const msg = await Message.findOne({where: {mid: req.params.mid}});
        if (msg) {
            res.status(200).send({ msg: msg});
        }
        else {
            res.status(404).send();
        }
    }
    catch (err) {
        res.status(500).send({'message': err.message});
    }
}

export const postMessage = async (req: Request, res: Response) => {
    try {
        const room = await Room.findOne({where: {rid : Number(req.body.rid)}});
        var rid = null;
        if (room) {
            rid = room.getDataValue('rid');
        }
        else {
            const newRoom = await Room.create({uid: Number(req.body.rid)});
            rid = newRoom.getDataValue('rid');
        }
        const nmsg = await Message.create({
            rid: rid,
            suid : req.body.suid,
            message : req.body.message,
        });
        res.status(201).send();
    }
    catch (err) {
        res.status(500).send({'message': err.message});
    }
}