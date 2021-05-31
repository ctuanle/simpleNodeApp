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
    const query = "SELECT * FROM users WHERE username=?";
    db.query(query, [user.username], (err, result) => {
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
        bcrypt.compare(user.password, userdata.password)
        .then((valid) => {
            if (!valid) {
                return callback(new Error("Incorrect password!"));
            }
        })
        .catch((err) => callback(err));

        /**
         * Sign a new token and send return it
         */
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
    })
}