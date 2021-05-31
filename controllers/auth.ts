import * as userModal from '../models/user';
import {BasicUser} from '../types/user';
import {Request, Response} from 'express';

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