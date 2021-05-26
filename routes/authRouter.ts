import express from 'express';
import * as userModal from '../models/user';
import {BasicUser, User} from '../types/user';

const authRouter = express.Router();

/**
 * GET login page
 */
authRouter.get('/login', (req, res) => {
    res.render('login', {
        title: 'Login'
    })
})

/**
 * GET signup page
 */
 authRouter.get('/signup', (req, res) => {
    res.render('signup', {
        title: 'Signup'
    })
})

/**
 * POST /auth/sigup : signup
 */
authRouter.post('/signup', (req, res) => {
    const newuser: BasicUser = {
        username : req.body.username,
        password : req.body.password
    }
    userModal.signup(newuser, (err: Error, uid: string) => {
        if (err) {
            return res.status(500).json({'errorMessage': err.message});
        }
        res.status(200).json({"message": "User account successfully created.", "uid": uid});
    })
})

/**
 * POST /auth/login : login
 */
authRouter.post('/login', (req, res) => {
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
})

export {authRouter};