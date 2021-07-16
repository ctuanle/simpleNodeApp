import { Request, Response } from "express";
import { UserModel } from "../db/models/user.model";

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
        if (user) {
            return res.status(200).send(user);
        }
        return res.status(404).send("User not found!");
    }   
    catch(err){
        res.status(500).json({ message: err.message });
    }
}

export const getUserByUsername = async (req:Request, res:Response) => {
    try {
        const user = await UserModel.findOne({
            where: { username: req.params.username },
        });
        if (user) {
            return res.status(200).send(user);
        }
        return res.status(404).send("User not found!");
    }   
    catch(err){
        res.status(500).json({ message: err.message });
    }
}