require("dotenv").config();
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

import { Request, Response } from "express";
import { sendmail } from "./sendmail";
import { SentMessageInfo } from "nodemailer";
import { UserModel } from "../db/models/user.model";

//--THESE ARE FOR RENDERING HTML PAGE

/**
 * GET Login Page
 * @param req
 * @param res
 */
export const getLogin = (req: Request, res: Response) => {
    try {
        res.render("auth/login", {
            title: "Login",
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

/**
 * GET Sign up Page
 * @param req
 * @param res
 */
export const getSignup = (req: Request, res: Response) => {
    try {
        res.render("auth/signup", {
            title: "Signup",
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

/**
 * GET forgot password page
 * @param req
 * @param res
 */
export const getForgotPassword = (req: Request, res: Response) => {
    try {
        res.render("auth/forgot-password", {
            title: "Reset Password",
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

/**
 * GET reset password page
 * @param req
 * @param res
 */
export const getResetPassword = (req: Request, res: Response) => {
    try {
        const uid = req.params.uid;
        const token = req.params.token;
        res.render("auth/reset-password", {
            title: "Reset Password",
            uid: uid,
            token: token,
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

// THESE ARE FOR POSTING REQUESTS

/**
 * POST a sign up request
 * @param req
 * @param res
 */
export const postSignup = async (req: Request, res: Response) => {
    try {
        // Check if username is already taken
        const userWithUsername = await UserModel.findOne({
            where: {
                username: req.body.username,
            },
        });
        if (userWithUsername) {
            return res
                .status(500)
                .json({ message: "Username is already taken!" });
        }

        // Check if email is already taken
        if (req.body.email !== "") {
            const userWithEmail = await UserModel.findOne({
                where: {
                    email: req.body.email,
                },
            });
            if (userWithEmail) {
                return res
                    .status(500)
                    .json({ message: "Email is already taken!" });
            }
        }

        // Hash the password and save the record to database
        const hash = await bcrypt.hash(req.body.password, 10);

        await UserModel.create({
            username: req.body.username,
            password: hash,
            email: req.body.email,
            role: "NORMAL_USER",
        });

        // Response with success.
        res.status(201).json({ message: "User account successfully created." });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * POST a login request
 * @param req
 * @param res
 */
export const postLogin = async (req: Request, res: Response) => {
    try {
        // Find the user with username
        const user = await UserModel.findOne({
            where: {
                username: req.body.username,
            },
        });

        // If there is no user with the username received => return
        if (!user) {
            return res.status(401).json({ message: "Username not found!" });
        }

        // Compare the passwords
        const match = await bcrypt.compare(
            req.body.password,
            user.get("password")
        );

        if (!match) {
            // Case: incorrect password => return
            return res.status(401).json({ message: "Incorrect password!" });
        }

        // Create a payload for token's creation
        const payload = {
            uid: user.get("uid"),
            username: user.get("username"),
            role: user.get("role"),
        };

        // GET the link to redirect after login
        const URL = user.get("role") === "ADMIN" ? "/admin" : "/";

        // Create a token
        const token = jwt.sign(
            payload,
            <jwt.Secret>process.env.TOKEN_SECRET_KEY,
            { expiresIn: "1h" }
        );

        // Login succesfully: set the cookie with the token created
        res.status(200)
            .cookie("ctle_user_token", token, {
                httpOnly: true,
                maxAge: 3599000,
                path: "/",
                sameSite: "strict",
            })
            .send({ newURL: URL });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const checkInfo = (req: Request, res: Response) => {
    try {
        if (req.cookies.ctle_user_token) {
            const token: string = req.cookies.ctle_user_token;
            const decodedToken = jwt.verify(
                token,
                <jwt.Secret>process.env.TOKEN_SECRET_KEY
            );
            const payload = <{ uid: number; role: string }>decodedToken;
            res.status(200).json({
                uid: payload.uid,
                role: payload.role,
                token: token,
            });
        } else {
            res.status(202).send();
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const postLogout = (req: Request, res: Response) => {
    try {
        // remove the cookie on browser
        res.clearCookie("ctle_user_token", {
            httpOnly: true,
            path: "/",
            sameSite: "strict",
        }).send();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const postForgotPassword = async (req: Request, res: Response) => {
    try {
        const email: string = req.body.email;
        if (!email) {
            return res.status(400).json({ message: "No email provided!" });
        }

        const user = await UserModel.findOne({
            where: {
                email: email,
            },
        });
        if (user) {
            const payload = {
                uid: user.getDataValue("uid"),
                email: user.getDataValue("email"),
            };

            const token: string = jwt.sign(
                payload,
                <jwt.Secret>user.getDataValue("password"),
                { expiresIn: "15m" }
            );
            const resetLink = `http://localhost:${process.env.PORT}/auth/reset/${payload.uid}/${token}`;

            const message = {
                from: "ctle@node.io",
                to: email,
                subject: "Reset Password",
                text:
                    "Here is your reset password link" +
                    resetLink +
                    ". You have 15min to reset your password! And you can use the link only one time. Please be sure.",
                html:
                    "<p>Here is your reset password link : <a href=" +
                    resetLink +
                    ">" +
                    resetLink +
                    "</a> You have 15min to reset your password. And you can use the link only one time. Please be sure.</p>",
            };
            sendmail(message, (err: Error, info: SentMessageInfo) => {
                if (err) {
                    return res.status(500).json({ message: err.message });
                } else {
                    return res.status(200).json({
                        message:
                            "Reset password link has been sent successfully. Please reset your password within 15min!",
                    });
                }
            });
        } else {
            //we do not tell the user that the email is not linked to any account
            res.status(205).json();
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const postResetPassword = async (req: Request, res: Response) => {
    try {
        const uid: string = req.body.uid;
        const token: string = req.body.token;
        const newPwd: string = req.body.password;

        const user = await UserModel.findOne({ where: { uid: uid } });
        if (!user) {
            return res.status(500).json({ message: "User not found!" });
        }

        const oldPassword = user.getDataValue("password");

        if (token) {
            jwt.verify(token, <jwt.Secret>oldPassword);
            const hash = await bcrypt.hash(newPwd, 10);
            const result = await user.update({ password: hash });
            if (result) {
                res.status(200).json({
                    message: "Password updated successfully!",
                });
            }
        } else {
            res.status(500).json({ message: "Token not found!" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
