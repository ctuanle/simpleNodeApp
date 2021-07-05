require('dotenv').config();
import bcrypt from 'bcrypt';
import * as jwt from "jsonwebtoken";
import {Sequelize} from 'sequelize';

import {Op} from 'sequelize';
import {Request, Response} from 'express';

import {Product} from '../db/models/product';
import { MessageModel } from '../db/models/message.model';
import {UserModel} from '../db/models/user.model';
import { AdminModel } from '../db/models/admin.model';
import { RoomModel } from '../db/models/room.model';
import { where } from 'sequelize';


export const getInfoAdmin = async (req: Request, res: Response) => {
    try {
        if (req.cookies.ctle_cookie_ad){
            const token: string = req.cookies.ctle_cookie_ad;
            const decodedToken = await jwt.verify(token, <jwt.Secret>process.env.TK_SK_AD);
            const payload = <{aid: string, username: string, iat: number, exp: number}>decodedToken
            res.status(200).send({'aid' : payload.aid, 'username': payload.username});
        }
        else {
            res.status(202).send();
        }
    }
    catch (err) {
        res.status(500).json({'message' : err.message});
    }
}

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
    
        res.render('admin/index_admin', {
            title: 'Admin Board',
            products : products,
            users : users,
            stats: stats,
            rooms: rooms
        });
    }
    catch(err) {
        res.status(500).json({'message': err.message});
    }
}


export const getLoginForAdmin = async (req: Request, res: Response) => {
    try {
        /**
         * Uncomment the following code and go to the /admin/login page
         * to manual create an admin
         * username : admin
         * password : azerty
         */
        // await AdminModel.create({
        //     username: 'admin',
        //     password : '$2b$10$7PrTqZuLv5LI0fCEQ4lo4OJd4ycn.LW8kPekjdqIbJqRvGrdrSpE.',
        //     email: ''
        // });
        res.render('admin/ad_login');
    }
    catch(err) {
        res.status(500).json({'message': err.message});
    }
}

export const postLoginForAdmin = async (req: Request, res: Response) => {
    try {
        const adminInstance = await AdminModel.findOne({
            where: {username : req.body.username}
        });
        if (adminInstance) {
            const isCorrectPassword = await bcrypt.compare(
                req.body.password,
                adminInstance.getDataValue('password')
            )
            if (isCorrectPassword) {
                const payload = {
                    aid: adminInstance.getDataValue('aid'),
                    username: adminInstance.getDataValue('username')
                }

                const token: string = jwt.sign(
                    payload,
                    <jwt.Secret>process.env.TK_SK_AD,
                    {expiresIn: '1h'}
                );
                res.writeHead(200, {
                    'Set-Cookie' : 'ctle_cookie_ad='+token+';SameSite=Strict; max-age=3570; path=/',
                    'Access-Control-Allow-Credentials': 'true'
                });
                res.end();
            }
            else {
                res.status(401).send({'message' : 'Incorrect password!'});
            }
        }
        else {
            res.status(404).send({'message' : 'Username not found!'});
        }
    }
    catch(err) {
        res.status(500).json({'message': err.message});
    }
}


export const postLogoutForAdmin = (req: Request, res: Response) => {
    try {
        res.writeHead(200, {
            'Set-Cookie': 'ctle_cookie_ad=; HttpOnly; SameSite=Strict; max-age=0; path=/',
            'Access-Control-Allow-Credentials': 'true'
        }).send();
    }
    catch (err) {
        res.status(500).json({'message' : err.message});
    }
}

export const getAddProduct = (req: Request, res: Response) => {
    try {
        res.render('admin/add-product_admin', {
            title: 'Add Product',
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
            res.render('admin/edit-product_admin', {
                title: 'Edit Product',
                product : product,
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
            res.render('admin/products_admin', {
                title: 'Products',
                numpage: Math.ceil(total / limit),
                products: products.rows
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
            res.render('admin/users_admin', {
                title: 'Users',
                numpage: Math.ceil(total / limit),
                users: users.rows
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
        res.render('admin/messages_admin', {
            title: 'Messages',
            rooms: rooms,
            displayMsg: false
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

        if (room) {
            const messages = await MessageModel.findAll({
                where: {roomId: room.getDataValue('rid')},
                order: [['createdAt', 'DESC']],
                // offset: 0,
                // limit: 15,
                raw: true
            });

            await room.update({read: true});

            res.render('admin/messages_admin', {
                title: 'Messages',
                rooms: rooms,
                displayMsg: true,
                messages: messages.slice().reverse(),
                uid: room.getDataValue('uid')
            });
        }
        else {
            res.status(404).json({message: 'todo'});
        }
        
    }
    catch(err){
        res.status(500).json({'message': err.message});
    }
}


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

        res.render('admin/ad_chat', {
            title: 'Message',
            messages: messages,
            uid : req.params.uid
        });
    }  
    catch (err) {
        res.status(500).json({'message': err.message});
    }
}