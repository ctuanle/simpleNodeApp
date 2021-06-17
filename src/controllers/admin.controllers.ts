require('dotenv').config();
import bcrypt from 'bcrypt';
import * as jwt from "jsonwebtoken";

import {Request, Response} from 'express';
import {Product} from '../db/models/product';


// import { Message } from '../db/models/message';
// import { Room } from '../db/models/room';
import {UserModel} from '../db/models/user.model';
import { AdminModel } from '../db/models/admin.model';


export const getInfoAdmin = async (req: Request, res: Response) => {
    try {
        if (req.cookies.ctle_cookie_ad){
            const token: string = req.cookies.ctle_cookie_ad;
            const decodedToken = await jwt.verify(token, <jwt.Secret>process.env.TK_SK_AD);
            const payload = <{aid: number, username: string, iat: number, exp: number}>decodedToken
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
            attributes: ['id', 'name', 'price', 'category', 'images'],
            raw : true
        })
        const users = await UserModel.findAll({
            attributes: ['uid', 'username'],
            raw : true
        })
        res.render('admin/ad_index', {
            title: 'Admin Board',
            products : products,
            users : users
        });
    }
    catch(err) {
        res.status(500).json({'message': err.message});
    }
}


export const getLoginForAdmin = (req: Request, res: Response) => {
    try {
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
                    {expiresIn: '15m'}
                );
                res.writeHead(200, {
                    'Set-Cookie' : 'ctle_cookie_ad='+token+';SameSite=Strict; max-age=840; path=/',
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
        res.render('admin/ad_add_product', {
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
            res.render('admin/ad_edit_product', {
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
        await Product.update({
            name: req.body.name,
            price: req.body.price,
            category: req.body.category,
            images: path
        }, {
            where: {id: req.params.pid}
        })
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


// export const getChatPage = async (req: Request, res: Response) => {
//     try {
//         const rid = await Room.findOne({where: {uid: req.params.uid}});
//         const messages = await Message.findAll({
//             attributes: ['mid', 'rid', 'suid', 'message'],
//             where: {rid : rid?.getDataValue('rid')},
//             raw : true
//         });
//         console.log(messages);
//         //res.status(200).json({messages: messages});
//         res.render('admin/chat', {
//             title: 'Message',
//             messages: messages
//         })
//     }  
//     catch (err) {
//         res.status(500).json({'message': err.message});
//     }
// }






