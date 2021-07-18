import axios from "axios";
import { Request, Response } from "express";
import { MessageModel } from "../db/models/message.model";
import { RoomModel } from "../db/models/room.model";
import { UserModel } from "../db/models/user.model";

require("dotenv").config();

const hostUrl = `http://${process.env.HOST}:${process.env.PORT}`;

export const getHomePage = (req: Request, res: Response) => {
    try {
        res.render("shop/sh_index", {
            title: "Home Page",
            user_info: res.locals.payload || null,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getProductById = async (req: Request, res: Response) => {
    try {
        const url = `${hostUrl}/api/product/${req.params.pid}`;
        const data = (await axios.get(url)).data;

        if (data && data.name) {
            return res.render("shop/sh_product", {
                title: data.name,
                product: data,
                user_info: res.locals.payload || null,
            });
        }

        res.status(404).json({ message: "Product not found" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getNProducts = async (req: Request, res: Response) => {
    try {
        const url = `${hostUrl}/api/product/page/${req.params.page}`;
        const data = (await axios.get(url)).data;

        if (data.numpage && data.products.length > 0) {
            return res.render("shop/sh_products", {
                title: "Products",
                numpage: data.numpage,
                products: data.products,
                user_info: res.locals.payload || null,
            });
        }

        res.status(404).json({ message: "Product not found" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getAllCategories = async (req: Request, res: Response) => {
    try {
        const url = `${hostUrl}/api/product/category/all`;
        const data = (await axios.get(url)).data;

        res.render("shop/sh_categories", {
            title: "Categories",
            categories: data,
            products: [],
            user_info: res.locals.payload || null,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getProductsByCategory = async (req: Request, res: Response) => {
    try {
        const url = `${hostUrl}/api/product/category/${req.params.cat}`;
        const data = (await axios.get(url)).data;

        res.render("shop/sh_categories", {
            title: "Categories",
            categories: data.cats,
            products: data.products,
            user_info: res.locals.payload || null,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getMessagesPage = async (req: Request, res: Response) => {
    try {
        // Check if the uid is valid
        const user = await UserModel.findOne({
            where: { uid: req.params.uid },
        });
        if (user && user.get("role") === "NORMAL_USER") {
            // Check if there is already a room for this user
            const room = await RoomModel.findOne({
                where: { uid: req.params.uid },
            });
            if (room) {
                // Get the messages
                const messages = await MessageModel.findAll({
                    where: { roomId: room.get("rid") },
                });
                return res.render("shop/sh_us_messages", {
                    title: "Message",
                    messages: messages,
                    roomId: room.get("rid"),
                    user_info: res.locals.payload || null,
                });
            }

            // Find an admin
            const admin = await UserModel.findOne({ where: { role: "ADMIN" } });
            if (admin) {
                // Create a room for this user
                const newRoom = await RoomModel.create({
                    uid: user.get("uid"),
                    aid: admin.get("uid"),
                    username: user.get("username"),
                    lastMsg: "",
                    read: true,
                });
                return res.render("shop/sh_us_messages", {
                    title: "Message",
                    messages: [],
                    roomId: newRoom.get("rid"),
                    user_info: res.locals.payload || null,
                });
            }
            res.status(500).json({ message: "No admin available" });
        }
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};
