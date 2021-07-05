require('dotenv').config();

import {Op} from 'sequelize';
import {Request, Response} from 'express';

import { MessageModel } from '../db/models/message.model';

export const getChatPage = async (req: Request, res: Response) => {
    try {
        const messages = await MessageModel.findAll({
            where: {
                [Op.or]: [
                    {rid : req.params.uid},
                    {sid : req.params.uid}
                ]
                }, raw:true
            }
        );
        
        res.render('user/user', {
            title: 'Message',
            messages : messages,
            uid : req.params.uid
        });
    }
    catch (err) {
        res.status(500).send({'message' : err.message});
    }
}