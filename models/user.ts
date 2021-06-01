import { BasicUser, User } from '../types/user';
import { db } from '../db';
import { OkPacket, RowDataPacket } from 'mysql2';
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

require('dotenv').config();

const findOneByUsername = (username: string, callback: Function) =>{
    const query = "SELECT * FROM users WHERE username=?";
    db.query(query, [username] , (err, result) => {
        if (err) {
            return callback(err);
        }
        const row = (<RowDataPacket>result)[0];
        if (!row) {
            return callback(new Error('Username not found!'));
        }
        const user: User = {
            uid : row.uid,
            username: row.username,
            password: row.password,
            email: row.email
        };
        callback(null, user);
    })
}

export const signup = (user: BasicUser, callback: Function) => {
    const queryusername = "SELECT * FROM users WHERE username=?";
    db.query(queryusername, [user.username], (err, result) => {
        if (err) {
            return callback(err);
        }
        const row = (<RowDataPacket>result)[0];
        if (row) {
            return callback(new Error('Username is already taken!'));
        }

        /**
         * Hash the password by using bcrypt and store it in the DB
         */
        bcrypt.hash(user.password, 10, (err, hash) => {
            if (err) {
                return callback(err);
            }
            const query = "INSERT INTO users(username, password, email) VALUES (?, ?, ?)";
            db.query(query, [user.username, hash, user.email], (err, result) => {
                if (err) {
                    return callback(err);
                }
                const uid = (<OkPacket>result).insertId;
                callback(null, uid);
            })
        })
    })
}

export const login = (user: BasicUser, callback: Function) => {
    findOneByUsername(user.username, (err: Error, userdata: User) => {
        if (err) {
            return callback(err);
        }
        /**
         * Hash the input password and compare it against the user's password'
         */
        bcrypt.compare(user.password, userdata.password, (err, same) => {
            if (err) {
                return callback(err);
            }
            if (same) {
                const token: string = jwt.sign(
                    {uid : userdata.uid},
                    <jwt.Secret>process.env.TOKEN_SECRET_KEY,
                    {expiresIn: '15m'}
                );
        
                const data = {
                    uid : userdata.uid,
                    token : token
                }
                callback(null, data);
            }
            else {
                return callback(new Error("Incorrect password!"));
            }  
        })
    })
}

export const forgotPassword = (email: string, callback: Function) => {
    const findUserbyEmail = "SELECT * FROM users WHERE email = ?";
    db.query(findUserbyEmail, [email] , (err, result) => {
        if (err) callback(err);
        if (result){
            const row = (<RowDataPacket>result)[0];
            if (!row) callback(new Error('Email address not found!'));
            const user:User = {
                uid: row.uid,
                username: row.username,
                email: row.email,
                password: row.password
            }
            const payload = {
                uid : user.uid,
                email : user.email
            }
            const token: string = jwt.sign(
                payload,
                <jwt.Secret>user.password,
                {expiresIn: '15m'}
            );
            const resetLink:string = `http://localhost:${process.env.PORT}/auth/reset/${payload.uid}/${token}`;
            return callback(null, resetLink);
        }
        callback(new Error('Email address not found!'));
    })
}

export const resetPassword = (uid: string, token:string, newPwd:string, callback: Function) => {
    const queryById = "SELECT * FROM users WHERE uid=?";
    db.query(queryById, [Number(uid)], (err, result) => {
        if (err) callback(err);
        if (result) {
            const row = (<RowDataPacket>result)[0];
            if (row){
                const oldPassword = row.password;
                if (token){
                    jwt.verify(
                        token,
                        <jwt.Secret>oldPassword,
                        (err, decodedToken) => {
                            if (err){
                                return callback(err);
                            }
                            bcrypt.hash(newPwd, 10, (err, hash) => {
                                if (err) callback(err);
                                const query = "UPDATE users SET password=? WHERE uid=?";
                                db.query(query, [hash, uid], (err, result) => {
                                    if (err) callback(err);                              
                                    return callback(null, 'Password updated successfully!');
                                })
                            })
                        }
                    )
                }
            }
        }
        else {  
            callback(new Error('Unknown error!'));
        } 
    })
}