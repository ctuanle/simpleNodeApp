import { Request, Response } from "express";
import { MessageModel } from "../db/models/message.model";

export const getTotalNumberMessages = async (req: Request, res: Response) => {
    try {
        const count = await MessageModel.count();
        res.status(200).json({ count: count });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const get15LatestMessage = async (req: Request, res: Response) => {
    try {
        const messages = await MessageModel.findAll({
            where: { roomId: req.body.rid },
            order: [["createdAt", "DESC"]],
            offset: 0,
            limit: 15,
            raw: true,
        });

        res.status(200).send(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getNext15Messages = async (req: Request, res: Response) => {
    try {
        const messages = await MessageModel.findAll({
            where: { roomId: req.body.rid },
            order: [["createdAt", "DESC"]],
            offset: Number(req.params.offset) * 15,
            limit: 15,
            raw: true,
        });

        res.status(200).send(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const postMessage = async (req: Request, res: Response) => {
    try {
        const msg = await MessageModel.create({
            sid: req.body.sid,
            rid: req.body.rid,
            message: req.body.message,
            roomId: req.body.roomId,
            read: false,
        });
        res.status(200).send(msg);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
