import {Sequelize, Op} from 'sequelize';
import {Request, Response} from 'express';
import {Product} from '../db/models/product';
import { MessageModel } from '../db/models/message.model';
import { RoomModel } from '../db/models/room.model';
import { UserModel } from '../db/models/user.model';

export const getHomePage = (req:Request, res:Response) => {
    try {
        res.render('shop/sh_index', {
            title: 'Home Page',
            user_info: res.locals.payload || null
        });
    }
    catch(err) {
        res.status(500).json({'message': err.message});
    }
}

export const getProductById = async (req: Request, res: Response) => {
    try {
        const product = await Product.findOne({
            attributes: ['id', 'name', 'price', 'category', 'images'],
            where: {id : req.params.pid},
        });
        
        if (product) {
            res.render('shop/sh_product', {
                title: product.get('name'),
                product: product,
                user_info: res.locals.payload || null
            })
        }
        else {
            res.status(404).json({'message' : 'Product not found'});
        }
    }
    catch (err) {
        res.status(500).json({'message': err.message});
    }
}

export const getNProducts = async (req: Request, res: Response) => {
    try {
        const limit:number = 12;
        
        if (Number(req.params.page) <= 0){
            return res.status(500).json({'message' : 'Product not found'});
        }
        
        const offset:number = (Number(req.params.page) - 1) * 12;

        const total = await Product.count();

        const products = await Product.findAndCountAll({
            attributes: ['id', 'name', 'price', 'category', 'images'],
            offset : offset,
            limit : limit,
            raw: true
        });

        if (products.count > 0) {
            res.render('shop/sh_products', {
                title: 'Products',
                numpage: Math.ceil(total / limit),
                products: products.rows,
                user_info: res.locals.payload || null
            })
        }
        else {
            res.status(404).json({'message' : 'Product not found'});
        }
    }
    catch (err) {
        res.status(500).json({'message': err.message});
    }
}

export const getAllCategories = async (req: Request, res: Response) => {
    try {
        const cats = await Product.findAll({
            attributes: [
                [Sequelize.fn('DISTINCT', Sequelize.col('category')), 'category']
            ]
        });
        if (cats.length > 0) {
            res.render('shop/sh_categories', {
                title : 'Categories',
                categories : cats.map(cat => cat.get('category')),
                products : [],
                user_info: res.locals.payload || null
            });
        }
        else {
            return res.status(404).json({'message': 'No category!'});
        }
    }
    catch (err) {
        res.status(500).json({'message': err.message});
    }
}


export const getProductsByCategory = async (req: Request, res: Response) => {
    try {
        const cats = await Product.findAll({
            attributes: [
                [Sequelize.fn('DISTINCT', Sequelize.col('category')), 'category']
            ]
        });

        const products = await Product.findAll({
            where: {
                category: req.params.cat
            }
        });
        res.render('shop/sh_categories', {
            title : 'Categories',
            categories : cats.map(cat => cat.get('category')),
            products : products,
            user_info: res.locals.payload || null
        });
    }
    catch (err) {
        res.status(500).json({'message': err.message});
    }
}

export const getMessagesPage = async (req: Request, res: Response) => {
    try {
        //Check if the uid is valid
        const user = await UserModel.findOne({where: {uid: req.params.uid}});
        if (user && user.get('role') === 'NORMAL_USER') {
            //Check if there is already a room for this user
            const room = await RoomModel.findOne({where: {uid: req.params.uid}});
            if (room) {
                //Get the messages
                const messages = await MessageModel.findAll({where: {roomId: room.get('rid')}});
                return res.render('shop/sh_us_messages', {
                    title: 'Message',
                    messages : messages,
                    roomId : room.get('rid'),
                    user_info: res.locals.payload || null
                });
            }
            
            //Find an admin
            const admin = await UserModel.findOne({where: {role: 'ADMIN'}});
            if (admin) {
                //Create a room for this user
                const newRoom = await RoomModel.create({
                    uid: user.get('uid'),
                    aid: admin.get('uid'),
                    username: user.get('username'),
                    lastMsg: '',
                    read: true
                });
                return res.render('shop/sh_us_messages', {
                    title: 'Message',
                    messages : [],
                    roomId: newRoom.get('rid'),
                    user_info: res.locals.payload || null
                });
            }
            res.status(500).json({message: 'No admin available'});
        }
    }
    catch (err) {
        res.status(500).send({'message' : err.message});
    }
}