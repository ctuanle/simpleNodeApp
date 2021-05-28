import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
require('dotenv').config();

export const requireLogin = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    if (authHeader){
        const token:string = authHeader.split(' ')[1];
        if (token){
            jwt.verify(
                token,
                <jwt.Secret>process.env.TOKEN_SECRET_KEY,
                (err, decodedToken) => {
                    if (err) {
                        return res.status(500).json({'errorMessage': err.message});
                    }
                    next();
                }
            )
        }
        else {
            return res.status(401).send({'errorMessage' : 'No token provided'});
        }
    }
}