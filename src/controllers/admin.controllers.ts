require('dotenv').config();
import {Request, Response} from 'express';

import {Product} from '../db/models/product';
import { MessageModel } from '../db/models/message.model';
import {UserModel} from '../db/models/user.model';
import { RoomModel } from '../db/models/room.model';

export const getHomepageForAdmin = async (req: Request, res: Response) => {
    try {
        const products = await Product.findAll({
            offset: 0,
            limit: 5,
            attributes: ['id', 'name', 'price', 'category', 'images'],
            raw : true
        })
        const users = await UserModel.findAll({
            offset: 0,
            limit: 5,
            attributes: ['uid', 'username'],
            raw : true
        })
        const numProds = await Product.count();
        const numUsers = await UserModel.count();
        const numMsgs = await MessageModel.count();

        const stats = {numProds: numProds, numUsers: numUsers, numMsgs: numMsgs};

        const rooms = await RoomModel.findAll({
            order: [['updatedAt', 'DESC']],
            offset: 0,
            limit: 5,
            raw: true
        });
    
        res.render('admin/ad_index', {
            title: 'Admin Board',
            products : products,
            users : users,
            stats: stats,
            rooms: rooms,
            user_info: res.locals.payload
        });
    }
    catch(err) {
        res.status(500).json({'message': err.message});
    }
}

export const getAddProduct = (req: Request, res: Response) => {
    try {
        res.render('admin/ad_product-add', {
            title: 'Add Product',
            user_info: res.locals.payload
        })
    }
    catch (err) {
        res.status(500).json({'message': err.message});
    }
}

export const postAddProduct = async (req: Request, res: Response) => {
    try {
        var path = undefined;
        if (req.file){
            path = req.file.path.slice(5);
        }
        await Product.create({
            name: req.body.name,
            price: req.body.price,
            category: req.body.category,
            images: path
        });
        res.status(201).json({'message' : 'Product added successfully!'});
    }
    catch (err) {
        res.status(500).json({'message': err.message});
    }
}


export const getEditProduct = async (req: Request, res: Response) => {
    try {
        const product = await Product.findOne({where: {id: req.params.pid}});
        if (product){
            res.render('admin/ad_product-edit', {
                title: 'Edit Product',
                product : product,
                user_info: res.locals.payload
            });
        }
        else{
            res.status(500).json({'message': 'Product not found!'});
        }
    }
    catch (err) {
        res.status(500).json({'message': err.message});
    }
}


export const putEditProduct = async (req: Request, res: Response) => {
    try {
        var path = undefined;
        if (req.file){
            path = req.file.path.slice(5)
        }
        if (path) {
            await Product.update({
                name: req.body.name,
                price: req.body.price,
                category: req.body.category,
                images: path
            }, {
                where: {id: req.params.pid}
            })
        }
        else {
            await Product.update({
                name: req.body.name,
                price: req.body.price,
                category: req.body.category
            }, {
                where: {id: req.params.pid}
            })
        }
        
        res.status(200).json({'message' : 'Product updated successfully!'});
    }
    catch (err) {
        res.status(500).json({'message': err.message});
    }
}


export const deleteProduct = async (req: Request, res: Response) => {
    try {
        await Product.destroy({where: {id: req.body.pid}});
        res.status(200).json({'message' : 'Product deleted successfully!'});
    }
    catch (err) {
        res.status(500).json({'message': err.message});
    }
}

export const getAllProductsPage = async (req:Request, res:Response) => {
    try {
        const limit:number = 12;
        
        if (Number(req.params.page) <= 0){
            return res.status(500).json({'message' : 'Product not found'});
        }
        
        const offset:number = (Number(req.params.page) - 1) * 12;

        const total = await Product.count();

        const products = await Product.findAndCountAll({
            offset : offset,
            limit : limit,
            raw: true
        });

        if (products.count > 0) {
            res.render('admin/ad_products', {
                title: 'Products',
                numpage: Math.ceil(total / limit),
                products: products.rows,
                user_info: res.locals.payload
            })
        }
        else {
            res.status(500).json({'message' : 'Product not found'});
        }
    }
    catch(err) {
        res.status(500).json({'message': err.message});
    }
}

export const getAllUsersPage = async (req:Request, res:Response) => {
    try {
        const limit:number = 12;
        
        if (Number(req.params.page) <= 0){
            return res.status(500).json({'message' : 'User not found'});
        }
        
        const offset:number = (Number(req.params.page) - 1) * 12;

        const total = await UserModel.count();

        const users = await UserModel.findAndCountAll({
            offset : offset,
            limit : limit,
            raw: true
        });

        if (users.count > 0) {
            res.render('admin/ad_users', {
                title: 'Users',
                numpage: Math.ceil(total / limit),
                users: users.rows,
                user_info: res.locals.payload
            })
        }
        else {
            res.status(500).json({'message' : 'User not found'});
        }
    }
    catch(err) {
        res.status(500).json({'message': err.message});
    }
}

export const getRoomsPage = async (req:Request, res:Response) => {
    try {
        const rooms = await RoomModel.findAll({
            order: [['updatedAt', 'DESC']]
        });
        res.render('admin/ad_messages', {
            title: 'Messages',
            rooms: rooms,
            displayMsg: false,
            user_info: res.locals.payload
        });
    }
    catch(err){
        res.status(500).json({'message': err.message});
    }
}

export const getMessagesPage = async (req:Request, res:Response) => {
    try {
        const rooms = await RoomModel.findAll({
            order: [['updatedAt', 'DESC']]
        });

        const room = await RoomModel.findOne({where: {uid: req.params.uid}});
        const user = await UserModel.findOne({where: {uid: req.params.uid}});

        if (room && user) {
            const messages = await MessageModel.findAll({
                where: {roomId: room.getDataValue('rid')},
                order: [['createdAt', 'DESC']],
                offset: 0,
                limit: 15,
                raw: true
            });

            await room.update({read: true});

            res.render('admin/ad_messages', {
                title: 'Messages',
                rooms: rooms,
                displayMsg: true,
                messages: messages.slice().reverse(),
                room: room,
                user_info: res.locals.payload
            });
        }
        else if (user) {
            const newRoom = await RoomModel.create({
                uid: user.getDataValue('uid'),
                aid: res.locals.payload.uid,
                username: user.getDataValue('username'),
                lastMsg: '',
                read: true
            });
            res.render('admin/ad_messages', {
                title: 'Messages',
                rooms: rooms,
                displayMsg: true,
                messages: [],
                uid: newRoom.getDataValue('uid'),
                user_info: res.locals.payload
            });
        }
        else {
            res.status(404).send({message: 'Given data is not found on server.'})
        }
    }
    catch(err){
        res.status(500).json({'message': err.message});
    }
}

export const getNextMessages = async (req: Request, res: Response) => {
    try {
        const room = await RoomModel.findOne({where: {uid: req.params.uid}});

        if (room) {
            const messages = await MessageModel.findAll({
                where: {roomId: room.getDataValue('rid')},
                order: [['createdAt', 'DESC']],
                offset: Number(req.params.offset)*15,
                limit: 15,
                raw: true
            });

            await room.update({read: true});

            res.status(200).json({messages : messages});
        }
        else {
            res.status(404).json({message: 'todo'});
        }
    }
    catch(err) {
        res.status(500).json({'message': err.message});
    }
}