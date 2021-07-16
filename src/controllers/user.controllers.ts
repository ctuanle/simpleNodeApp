require("dotenv").config();
import { Request, Response } from "express";

import { MessageModel } from "../db/models/message.model";
import { UserModel } from "../db/models/user.model";
import { RoomModel } from "../db/models/room.model";

export const get5User = async (req:Request, res:Response) => {
    try {
        const users = await UserModel.findAll({
            offset: 0,
            limit: 5,
            attributes: ["uid", "username"],
            raw: true,
        });
        res.status(200).send(users);
    }
    catch(err) {
        res.status(500).json({ message: err.message });
    }
}

export const getTotalNumberUsers = async (req:Request, res:Response) => {
    try {
        const count = await UserModel.count();
        res.status(200).json({count: count});
    }
    catch(err){
        res.status(500).json({ message: err.message });
    }
}

export const getUserById = async (req:Request, res:Response) => {
    try {
        const user = await UserModel.findOne({
            where: { uid: req.params.uid },
        });
        res.status(200).send(user);
    }
    catch(err){
        res.status(500).json({ message: err.message });
    }
}