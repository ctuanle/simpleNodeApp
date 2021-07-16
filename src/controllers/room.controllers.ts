import { Request, Response } from "express";
import { RoomModel } from "../db/models/room.model";

export const getFirst5Rooms = async (req:Request, res:Response) => {
    try {
        const rooms = await RoomModel.findAll({
            order: [["updatedAt", "DESC"]],
            offset: 0,
            limit: 5,
            raw: true,
        });
        res.status(200).send(rooms);
    }
    catch(err){
        res.status(500).json({ message: err.message });
    }
}

export const getAllRooms = async (req:Request, res:Response) => {
    try {
        const rooms = await RoomModel.findAll({
            order: [["updatedAt", "DESC"]],
        });
        res.status(200).send(rooms);
    }
    catch(err){
        res.status(500).json({ message: err.message });
    }
}

export const getRoomById = async (req:Request, res:Response) => {
    try {
        const room = await RoomModel.findOne({
            where: { rid: req.params.rid },
        });
        if (room) {
            return res.status(200).send(room);
        }
        res.status(404).send("Room not found!");
    }
    catch(err){
        res.status(500).json({ message: err.message });
    }
}

export const getRoomByUid = async (req:Request, res:Response) => {
    try {
        const room = await RoomModel.findOne({
            where: { uid: req.params.uid },
        });
        if (room) {
            return res.status(200).send(room);
        }
        res.status(404).send("Room not found!");
    }
    catch(err){
        res.status(500).json({ message: err.message });
    }
}

export const postAddRoom = async (req:Request, res:Response) => {
    try {
        const newRoom = await RoomModel.create({
            uid: req.body.uid,
            aid: res.locals.payload.uid,
            username: req.body.username,
            lastMsg: "",
            read: true,
        });
        res.status(200).send(newRoom);
    }
    catch(err){
        res.status(500).json({ message: err.message });
    }
}

export const putUpdateRead = async (req:Request, res:Response) => {
    try {
        await RoomModel.update(
            {read: true},
            {where: {rid: req.body.rid}}
        );
        res.status(200).send("Room updated successfully!");
    }
    catch(err){
        res.status(500).json({ message: err.message });
    }
}

export const putUpdateLastMsg = async (req:Request, res:Response) => {
    try {
        await RoomModel.update(
            {
                read: req.body.read, 
                lastMsg: req.body.lastMsg
            },
            {
                where: {
                    rid: req.body.rid
                }
            }
        );
        res.status(200).send("Room updated successfully!");
    }
    catch(err){
        res.status(500).json({ message: err.message });
    }
}