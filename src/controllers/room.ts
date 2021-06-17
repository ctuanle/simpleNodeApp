import {Request, Response} from 'express';
import {Room} from '../db/models/room';

export const getAllRooms = async (req: Request, res: Response) => {
    try {
        const rooms = await Room.findAll();
        console.log(rooms);
    }
    catch (err) {
        res.status(500).send({ message : err.message });
    }
}

export const getRoomById = async (req: Request, res: Response) => {
    try {
        const room = await Room.findOne({where: {rid : req.params.rid} });
    }
    catch (err) {
        res.status(500).send({ message : err.message});
    }
}

export const postAddRoom = async (req: Request, res: Response) => {
    try {
        const rm = await Room.findOne({where: {uid : req.body.uid} });
        if (rm) {
            res.status(409).send({ message : 'Room already exists!', rid : rm.getDataValue('rid')});
        }
        else {
            const newRoom = await Room.create({uid : req.body.uid});
            if (newRoom) {
                res.status(201).send({ message : 'Room created successfully!', rid : newRoom.getDataValue('rid')});
            }
        }
    }
    catch (err) {
        res.status(500).send({ message : err.message});
    }
}