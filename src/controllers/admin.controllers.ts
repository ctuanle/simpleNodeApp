import axios from "axios";
import { Request, Response } from "express";
require("dotenv").config();

const hostUrl = `http://${process.env.HOST}:${process.env.PORT}`;

export const getHomepageForAdmin = async (req: Request, res: Response) => {
    try {
        const products = (await axios.get(`${hostUrl}/api/product/page/1`)).data.products;
        const users = (
            await axios.get(`${hostUrl}/api/user/five`, {
                headers: {
                    Cookie: `ctle_user_token=${req.cookies.ctle_user_token}`,
                },
            })
        ).data;

        const numProds = (
            await axios.get(`${hostUrl}/api/product/count/all`, {
                headers: {
                    Cookie: `ctle_user_token=${req.cookies.ctle_user_token}`,
                },
            })
        ).data.count;

        const numUsers = (
            await axios.get(`${hostUrl}/api/user/count`, {
                headers: {
                    Cookie: `ctle_user_token=${req.cookies.ctle_user_token}`,
                },
            })
        ).data.count;

        const numMsgs = (
            await axios.get(`${hostUrl}/api/message/count`, {
                headers: {
                    Cookie: `ctle_user_token=${req.cookies.ctle_user_token}`,
                },
            })
        ).data.count;

        const stats = {
            numProds: numProds,
            numUsers: numUsers,
            numMsgs: numMsgs,
        };

        const rooms = (
            await axios.get(`${hostUrl}/api/room/five`, {
                headers: {
                    Cookie: `ctle_user_token=${req.cookies.ctle_user_token}`,
                },
            })
        ).data;

        res.render("admin/ad_index", {
            title: "Admin Board",
            products: products,
            users: users,
            stats: stats,
            rooms: rooms,
            user_info: res.locals.payload,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getAddProduct = async (req: Request, res: Response) => {
    try {
        const cats = (await axios.get(`${hostUrl}/api/product/category/all`)).data;

        res.render("admin/ad_product-add", {
            title: "Add Product",
            cats: cats,
            user_info: res.locals.payload,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getEditProduct = async (req: Request, res: Response) => {
    try {
        const cats = (await axios.get(`${hostUrl}/api/product/category/all`)).data;

        const product = (await axios.get(`${hostUrl}/api/product/${req.params.pid}`)).data;

        if (product) {
            res.render("admin/ad_product-edit", {
                title: "Edit Product",
                product: product,
                cats: cats,
                user_info: res.locals.payload,
            });
        } else {
            res.status(500).json({ message: "Product not found!" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getAllProductsPage = async (req: Request, res: Response) => {
    try {
        const data = (await axios.get(`${hostUrl}/api/product/page/${req.params.page}`)).data;

        res.render("admin/ad_products", {
            title: "Products",
            numpage: data.numpage,
            products: data.products,
            user_info: res.locals.payload,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getAllUsersPage = async (req: Request, res: Response) => {
    try {
        const data = (
            await axios.get(`${hostUrl}/api/user/all/${req.params.page}`, {
                headers: {
                    Cookie: `ctle_user_token=${req.cookies.ctle_user_token}`,
                },
            })
        ).data;

        res.render("admin/ad_users", {
            title: "Users",
            numpage: data.numpage,
            users: data.users,
            user_info: res.locals.payload,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getRoomsPage = async (req: Request, res: Response) => {
    try {
        const data = (
            await axios.get(`${hostUrl}/api/room/all`, {
                headers: {
                    Cookie: `ctle_user_token=${req.cookies.ctle_user_token}`,
                },
            })
        ).data;
        res.render("admin/ad_messages", {
            title: "Messages",
            rooms: data,
            displayMsg: false,
            user_info: res.locals.payload,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getMessagesPage = async (req: Request, res: Response) => {
    try {
        const rooms = (
            await axios.get(`${hostUrl}/api/room/all`, {
                headers: {
                    Cookie: `ctle_user_token=${req.cookies.ctle_user_token}`,
                },
            })
        ).data;

        const room = (
            await axios.get(`${hostUrl}/api/room/${req.params.uid}`, {
                headers: {
                    Cookie: `ctle_user_token=${req.cookies.ctle_user_token}`,
                },
            })
        ).data;

        const user = (
            await axios.get(`${hostUrl}/api/user/${req.params.uid}`, {
                headers: {
                    Cookie: `ctle_user_token=${req.cookies.ctle_user_token}`,
                },
            })
        ).data;

        if (room && user) {
            const messages = (
                await axios.get(`${hostUrl}/api/message/latest15`, {
                    headers: {
                        Cookie: `ctle_user_token=${req.cookies.ctle_user_token}`,
                    },
                    data: {
                        rid: room.rid,
                    },
                })
            ).data;

            // await axios.put(`${hostUrl}/api/room/update/read`, {
            //     headers: {
            //         Cookie: `ctle_user_token=${req.cookies.ctle_user_token}`
            //     }
            // });

            res.render("admin/ad_messages", {
                title: "Messages",
                rooms: rooms,
                displayMsg: true,
                messages: messages.slice().reverse(),
                room: room,
                user_info: res.locals.payload,
            });
        } else if (user) {
            // const newRoom = await RoomModel.create({
            //     uid: user.getDataValue("uid"),
            //     aid: res.locals.payload.uid,
            //     username: user.getDataValue("username"),
            //     lastMsg: "",
            //     read: true,
            // });

            const newRoom = (
                await axios.post(`${hostUrl}/api/room/add`, {
                    headers: {
                        Cookie: `ctle_user_token=${req.cookies.ctle_user_token}`,
                    },
                    data: {
                        uid: user.uid,
                        username: user.username,
                    },
                })
            ).data;

            res.render("admin/ad_messages", {
                title: "Messages",
                rooms: rooms,
                displayMsg: true,
                messages: [],
                room: newRoom,
                uid: newRoom.uid,
                user_info: res.locals.payload,
            });
        } else {
            res.status(404).send({
                message: "Given data is not found on server.",
            });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getNextMessages = async (req: Request, res: Response) => {
    try {
        const room = (
            await axios.get(`${hostUrl}/api/room/${req.params.uid}`, {
                headers: {
                    Cookie: `ctle_user_token=${req.cookies.ctle_user_token}`,
                },
            })
        ).data;

        if (room) {
            const messages = (
                await axios.get(`${hostUrl}/api/message/next/${req.params.offset}`, {
                    headers: {
                        Cookie: `ctle_user_token=${req.cookies.ctle_user_token}`,
                    },
                    data: {
                        rid: room.rid,
                    },
                })
            ).data;

            // await room.update({ read: true });

            res.status(200).json({ messages: messages });
        } else {
            res.status(404).json({ message: "todo" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
