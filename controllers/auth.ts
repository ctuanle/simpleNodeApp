import * as userModel from '../models/user';
import {BasicUser} from '../types/user';
import {Request, Response} from 'express';
import {sendmail} from './sendmail';
require('dotenv').config();
import {SentMessageInfo} from 'nodemailer';

import * as jwt from "jsonwebtoken";

export const getLogin = (req: Request, res: Response) => {
    res.render('user/login', {
        title: 'Login'
    })
}

export const getSignup = (req: Request, res: Response) => {
    res.render('user/signup', {
        title: 'Signup'
    })
}

export const getForgotPassword = (req: Request, res: Response) => {
    res.render('user/forgot-password', {
        title: 'Reset Password'
    })
}

export const getResetPassword = (req: Request, res: Response) => {
    const uid = req.params.uid;
    const token = req.params.token;
    res.render('user/reset-password', {
        title: 'Reset Password',
        uid: uid,
        token: token
    })
}

export const postSignup = (req: Request, res: Response) => {
    const newuser: BasicUser = {
        username : req.body.username,
        password : req.body.password,
        email: req.body.email
    }
    userModel.signup(newuser, (err: Error, uid: string) => {
        if (err) {
            return res.status(500).json({'message': err.message});
        }
        res.status(201).json({"message": "User account successfully created.", "uid": uid});
    })
}

export const postLogin = (req: Request, res: Response) => {
    const user: BasicUser = {
        username : req.body.username,
        password : req.body.password
    }
    userModel.login(user, (err: Error, data:{uid: string; token: string}) => {
        if (err) {
            return res.status(500).json({'message': err.message});
        }
        res.writeHead(200, {
            'Set-Cookie': 'ctle_user_token=' + data.token +'; HttpOnly; SameSite=Strict; max-age=840; path=/',
            'Access-Control-Allow-Credentials': 'true'
        }).send();
    })
}

export const postLogout = (req: Request, res: Response) => {
    res.writeHead(200, {
        'Set-Cookie': 'ctle_user_token=; HttpOnly; SameSite=Strict; max-age=0; path=/',
        'Access-Control-Allow-Credentials': 'true'
    }).send();
}

export const checkIsLogin = (req: Request, res: Response) => {
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

export const postForgotPassword = (req: Request, res: Response) => {
    const email: string = req.body.email;
    if (!email){
        return res.status(500).json({'message': 'Invalid email!'});
    }
    var message = {};
    userModel.forgotPassword(email, (err: Error, result: string) => {
        if (err) {
            return res.status(500).json({'message': err.message});
        }
        message = {
            from: 'ctle@node.io',
            to : email,
            subject : 'Reset Password',
            text : 'Here is your reset password link' + result + '. You have 15min to reset your password!',
            html : '<p>Here is your reset password link : <a href='+result+'>' + result + '</a> You have 15min to reset your password.</p>'
        }
        sendmail(message, (err: Error, info: SentMessageInfo) => {
            if (err) {
                return res.status(500).json({'message': err.message});
            }
            else {
                return res.status(200).json({'message': 'Reset password link has been sent successfully. Please reset your password within 15min!'});
            }
        })
    })
    
}


export const postResetPassword = (req: Request, res: Response) => {
    const uid = req.body.uid;
    const token = req.body.token;
    const newPwd = req.body.password;
    userModel.resetPassword(uid, token, newPwd, (err: Error, result: string) => {
        if (err) {
            return res.status(500).json({'message': err.message});
        }
        res.status(200).json({'message': 'Password updated successfully! You can log in now!'});
    })
}