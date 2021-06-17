import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
require('dotenv').config();


export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.cookies.ctle_cookie_ad) {
            const token: string = req.cookies.ctle_cookie_ad;
            await jwt.verify(token, <jwt.Secret>process.env.TK_SK_AD);
            next();
        }
        else {
            //res.status(401).json();
            res.redirect('/admin/login');
        }
    }
    catch (err) {
        res.status(500).json({'message' : err.message});
    }
}