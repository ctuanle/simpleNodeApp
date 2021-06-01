import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
require('dotenv').config();

export const requireCookie = (req: Request, res: Response, next: NextFunction) => {
    if (!req.cookies.ctle_user_token) {
        res.status(401).send();
    }
    else {
        const token: string = req.cookies.ctle_user_token;
        jwt.verify(
            token,
            <jwt.Secret>process.env.TOKEN_SECRET_KEY,
            (err) => {
                if (err) {
                    return res.status(500).json({'errorMessage': err.message});
                }
                next();
            }
        )
    }
}