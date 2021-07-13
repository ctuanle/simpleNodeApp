import { Request, Response } from "express";
import { ProductModel } from "../db/models/product.model";
import { MessageModel } from "../db/models/message.model";
import { RoomModel } from "../db/models/room.model";
import { UserModel } from "../db/models/user.model";

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
        const product = await ProductModel.findOne({
            attributes: ["pid", "name", "price", "category", "images"],
            where: { pid: req.params.pid },
        });

        if (product) {
            res.render("shop/sh_product", {
                title: product.get("name"),
                product: product,
                user_info: res.locals.payload || null,
            });
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getNProducts = async (req: Request, res: Response) => {
    try {
        const limit = 12;

        if (Number(req.params.page) <= 0) {
            return res.status(500).json({ message: "Product not found" });
        }

        const offset: number = (Number(req.params.page) - 1) * 12;

        const total = await ProductModel.count();

        const products = await ProductModel.findAndCountAll({
            attributes: ["pid", "name", "price", "category", "images"],
            offset: offset,
            limit: limit,
            raw: true,
        });

        if (products.count > 0) {
            res.render("shop/sh_products", {
                title: "Products",
                numpage: Math.ceil(total / limit),
                products: products.rows,
                user_info: res.locals.payload || null,
            });
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getAllCategories = async (req: Request, res: Response) => {
    try {
        const cats = JSON.parse(
            JSON.stringify(ProductModel.rawAttributes.category.type)
        );

        if (cats.values.length > 0) {
            res.render("shop/sh_categories", {
                title: "Categories",
                categories: cats.values,
                products: [],
                user_info: res.locals.payload || null,
            });
        } else {
            return res.status(404).json({ message: "No category!" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getProductsByCategory = async (req: Request, res: Response) => {
    try {
        const cats = JSON.parse(
            JSON.stringify(ProductModel.rawAttributes.category.type)
        );

        const products = await ProductModel.findAll({
            where: {
                category: req.params.cat,
            },
        });

        if (cats.values.length > 0) {
            res.render("shop/sh_categories", {
                title: "Categories",
                categories: cats.values,
                products: products,
                user_info: res.locals.payload || null,
            });
        } else {
            return res.status(404).json({ message: "No category!" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getMessagesPage = async (req: Request, res: Response) => {
    try {
        //Check if the uid is valid
        const user = await UserModel.findOne({
            where: { uid: req.params.uid },
        });
        if (user && user.get("role") === "NORMAL_USER") {
            //Check if there is already a room for this user
            const room = await RoomModel.findOne({
                where: { uid: req.params.uid },
            });
            if (room) {
                //Get the messages
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

            //Find an admin
            const admin = await UserModel.findOne({ where: { role: "ADMIN" } });
            if (admin) {
                //Create a room for this user
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
