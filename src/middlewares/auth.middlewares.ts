import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
require('dotenv').config();

function verifyToken(req: Request, res: Response, next: NextFunction, role:string) {
    try {
        if (req.cookies.ctle_user_token) {
            const token: string = req.cookies.ctle_user_token;
            const payload = jwt.verify(token, <jwt.Secret>process.env.TOKEN_SECRET_KEY);
            const roleFromToken:string = (<{role:string}>payload).role;
            if (!role) {
                res.locals.payload = payload;
                return next();
            }
            else {
                if (roleFromToken === role) {
                    res.locals.payload = payload;
                    return next();
                }
                res.status(401).json({message: 'Unauthorized!'});
            }
        }
        else {
            if (!role) {
                return next();
            }
            res.status(401).json({message: 'Unauthorized'});
        }
    }
    catch(err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({message: err.message, error: err});
        }
        res.status(500).json({message : err.message, error: err});
    }
    
}

// Public routes: does not require login, but this help this help
// decoding cookie if there is one and passing them to the next req
export const requireNoThing = (req:Request, res:Response, next:NextFunction) => {
    verifyToken(req, res, next, "");
}

// Protected routes: require login as a normal user
export const requireRoleUser = (req:Request, res:Response, next:NextFunction) => {
    verifyToken(req, res, next, "NORMAL_USER");
}

// Protected routes: require login as an admin
export const requireRoleAdmin = (req:Request, res:Response, next:NextFunction) => {
    verifyToken(req, res, next, "ADMIN");
}

