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

export const getAllUsers = async (req:Request, res:Response) => {
    try {
        const limit = 12;

        if (Number(req.params.page) <= 0) {
            return res.status(500).json({ message: "User not found" });
        }

        const offset: number = (Number(req.params.page) - 1) * 12;

        const total = await UserModel.count();

        const users = await UserModel.findAll({
            offset: offset,
            limit: limit,
            raw: true,
        });

        res.status(200).json({
            numpage: Math.ceil(total / limit),
            users: users
        });
    }   
    catch(err){
        res.status(500).json({ message: err.message });
    }
}