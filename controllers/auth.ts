require('dotenv').config();
import bcrypt from 'bcrypt';
import * as jwt from "jsonwebtoken";

import {Request, Response} from 'express';
import {sendmail} from './sendmail';
import {SentMessageInfo} from 'nodemailer';
import {User} from '../db/models/user';


export const getLogin = (req: Request, res: Response) => {
    try {
        res.render('user/login', {
            title: 'Login'
        })
    }
    catch (err) {
        res.status(500).send({'message': err.message});
    }
    
}

export const getSignup = (req: Request, res: Response) => {
    try {
        res.render('user/signup', {
            title: 'Signup'
        })
    }
    catch (err) {
        res.status(500).send({'message': err.message});
    }
}

export const getForgotPassword = (req: Request, res: Response) => {
    try {
        res.render('user/forgot-password', {
            title: 'Reset Password'
        })
    }
    catch (err) {
        res.status(500).send({'message': err.message});
    }
}

export const getResetPassword = (req: Request, res: Response) => {
    try {
        const uid = req.params.uid;
        const token = req.params.token;
        res.render('user/reset-password', {
            title: 'Reset Password',
            uid: uid,
            token: token
        })
    }
    catch (err) {
        res.status(500).send({'message': err.message});
    }
    
}

export const postSignup = async (req: Request, res: Response) => {
    try {
        await User.sync({alter:true})
        const userWithUsername = await User.findOne({
            attributes: ['username'],
            where: {
                username: req.body.username
            }
        })
        const userWithEmail = await User.findOne({
            attributes: ['email'],
            where: {
                email: req.body.email
            }
        })
        if (userWithUsername) {
            res.status(500).json({'message' : 'Username is already taken!'});
        }
        else if (userWithEmail) {
            res.status(500).json({'message' : 'Email is already taken!'});
        }
        else {
            const hash = await bcrypt.hash(req.body.password, 10);
            const user = await User.create({
                username: req.body.username,
                password: hash,
                email: req.body.email
            });
            if (user) {
                res.status(201).json({"message": "User account successfully created."});
            }
        }
    }
    catch (err) {
        res.status(500).json({'message' : err.message});
    }
}

export const postLogin = async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({
            where: {
                username: req.body.username
            }
        });
        if (user) {
            bcrypt.compare(
                req.body.password,
                user.getDataValue('password'),
                (err, same) => {
                    if (err) {
                        res.status(500).json({'message' : err.message});
                    }
                    else if (same) {
                        const token: string = jwt.sign(
                            {uid : user.getDataValue('uid')},
                            <jwt.Secret>process.env.TOKEN_SECRET_KEY,
                            {expiresIn: '15m'}
                        );
                        res.writeHead(200, {
                            'Set-Cookie': 'ctle_user_token=' + token +'; HttpOnly; SameSite=Strict; max-age=840; path=/',
                            'Access-Control-Allow-Credentials': 'true'
                        }).send();
                    }
                    else {
                        res.status(500).json({'message' : 'Incorrect password!'});
                    }
                }
            )
        }
        else {
            res.status(500).json({'message' : 'Username not found!'});
        }
    }
    catch (err) {
        res.status(500).json({'message' : err.message});
    }
}

export const postLogout = (req: Request, res: Response) => {
    try {
        res.writeHead(200, {
            'Set-Cookie': 'ctle_user_token=; HttpOnly; SameSite=Strict; max-age=0; path=/',
            'Access-Control-Allow-Credentials': 'true'
        }).send();
    }
    catch (err) {
        res.status(500).json({'message' : err.message});
    }
}

export const checkIsLogin = (req: Request, res: Response) => {
    try {
        if (req.cookies.ctle_user_token){
            const token: string = req.cookies.ctle_user_token;
            jwt.verify(
                token,
                <jwt.Secret>process.env.TOKEN_SECRET_KEY,
                (err) => {
                    if (err) {
                        return res.status(500).json({'errorMessage': err.message});
                    }
                    res.status(200).send();
                }
            )
        }
        else {
            res.status(202).send();
        }
    }
    catch (err) {
        res.status(500).json({'message' : err.message});
    }
}

export const postForgotPassword = async (req: Request, res: Response) => {
    try {
        const email: string= req.body.email;
        if(!email) {
            return res.status(400).json({'message': 'No email provided!'});
        }
        
        const user = await User.findOne({
            where: {
                email: email
            }
        });
        if(user) {
            const payload = {
                uid: user.getDataValue('uid'),
                email: user.getDataValue('email')
            }

            const token: string = jwt.sign(
                payload,
                <jwt.Secret>user.getDataValue('password'),
                {expiresIn: '15m'}
            )
            const resetLink: string =  `http://localhost:${process.env.PORT}/auth/reset/${payload.uid}/${token}`;
            
            const message = {
                from: 'ctle@node.io',
                to : email,
                subject : 'Reset Password',
                text : 'Here is your reset password link' + resetLink + '. You have 15min to reset your password! And you can use the link only one time. Please be sure.',
                html : '<p>Here is your reset password link : <a href='+resetLink+'>' + resetLink + '</a> You have 15min to reset your password. And you can use the link only one time. Please be sure.</p>'
            }
            sendmail(message, (err: Error, info: SentMessageInfo) => {
                if (err) {
                    return res.status(500).json({'message': err.message});
                }
                else {
                    return res.status(200).json({'message': 'Reset password link has been sent successfully. Please reset your password within 15min!'});
                }
            })
        }
        else {
            //we do not tell the user that the email is not linked to any account
            res.status(205).json();
        }
    }
    catch (err) {
        res.status(500).json({'message': err.message});
    }
}

export const postResetPassword = async (req: Request, res: Response) => {
    try {
        const uid: number =Number( req.body.uid);
        const token: string = req.body.token;
        const newPwd: string = req.body.password;
        
        const user = await User.findOne({where: {uid: uid}});
        if (!user) {
            return res.status(500).json({'message': 'User not found!'});
        }

        const oldPassword = user.getDataValue('password');

        if (token){
            const decodedToken = await jwt.verify(
                token,
                <jwt.Secret>oldPassword
            )
            const hash = await bcrypt.hash(newPwd, 10);
            const result = await user.update({password: hash});
            if (result) {
                res.status(200).json({'message': 'Password updated successfully!'});
            }
        }
        else {
            res.status(500).json({'message': 'Token not found!'});
        }
    }
    catch (err) {
        res.status(500).json({'message': err.message});
    }
}
