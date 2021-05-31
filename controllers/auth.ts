import * as userModal from '../models/user';
import {BasicUser} from '../types/user';
import {Request, Response} from 'express';
import {sendmail} from './sendmail';
require('dotenv').config();
import {SentMessageInfo} from 'nodemailer';

export const getLogin = async (req: Request, res: Response) => {
    res.render('user/login', {
        title: 'Login'
    })
}

export const getSignup = async (req: Request, res: Response) => {
    res.render('user/signup', {
        title: 'Signup'
    })
}

export const getForgotPassword = async (req: Request, res: Response) => {
    res.render('user/forgot-password', {
        title: 'Reset Password'
    })
}

export const getResetPassword = async (req: Request, res: Response) => {
    const uid = req.params.uid;
    const token = req.params.token;
    res.render('user/reset-password', {
        title: 'Reset Password',
        uid: uid,
        token: token
    })
}

export const postSignup = async (req: Request, res: Response) => {
    const newuser: BasicUser = {
        username : req.body.username,
        password : req.body.password,
        email: req.body.email
    }
    userModal.signup(newuser, (err: Error, uid: string) => {
        if (err) {
            return res.status(500).json({'errorMessage': err.message});
        }
        res.status(200).json({"message": "User account successfully created.", "uid": uid});
    })
}

export const postLogin = async (req: Request, res: Response) => {
    const user: BasicUser = {
        username : req.body.username,
        password : req.body.password
    }
    userModal.login(user, (err: Error, data:{uid: string; token: string}) => {
        if (err) {
            return res.status(500).json({'errorMessage': err.message});
        }
        res.status(200).json({"uid": data.uid, "token": data.token});
    })
}

export const postForgotPassword = async (req: Request, res: Response) => {
    const email: string = req.body.email;
    if (!email){
        return res.status(500).json({'errorMessage': 'Invalid email!'});
    }
    var message = {};
    userModal.forgotPassword(email, (err: Error, result: string) => {
        if (err) {
            return res.status(500).json({'errorMessage': err.message});
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
                return res.status(500).json({'errorMessage': err.message});
            }
            else {
                return res.status(200).json({'info': info});
            }
        })
    })
    
}


export const postResetPassword = async (req: Request, res: Response) => {
    const uid = req.body.uid;
    const token = req.body.token;
    const newPwd = req.body.password;
    userModal.resetPassword(uid, token, newPwd, (err: Error, result: string) => {
        if (err) {
            return res.status(500).json({'errorMessage': err.message});
        }
        res.status(200).json({'message': result});
    })
}