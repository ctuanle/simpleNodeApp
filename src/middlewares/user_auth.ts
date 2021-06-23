import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
require('dotenv').config();

export const requireLogin = async (req: Request, res: Response, next: NextFunction) => {
    try{
        if (req.cookies.ctle_user_token) {
            const token: string = req.cookies.ctle_user_token;
            await jwt.verify(token, <jwt.Secret>process.env.TOKEN_SECRET_KEY);
            next();
        }
        else {
            //res.status(401).json();
            res.redirect('/');
        }
    }
    catch (err) {
        res.status(500).json({'message' : err.message});
    }
}