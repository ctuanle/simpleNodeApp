import { Request, Response } from "express";
import { ProductModel } from "../db/models/product.model";

export const getProductById = async (req: Request, res: Response) => {
    try {
        const prod = await ProductModel.findOne({
            where: {
                pid: req.params.pid,
            },
            raw: true,
        });
        if (prod) {
            return res.status(200).send(prod);
        }
        res.status(404).send("Product not found!");
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getNProduct = async (req: Request, res: Response) => {
    try {
        const limit = 12;

        if (Number(req.params.page) <= 0) {
            return res.status(500).json({ message: "Product not found" });
        }

        const offset: number = (Number(req.params.page) - 1) * 12;

        const total = await ProductModel.count();

        const products = await ProductModel.findAll({
            offset: offset,
            limit: limit,
            raw: true,
        });

        return res.status(200).json({
            numpage: Math.ceil(total / limit),
            products: products,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getAllCategories = async (req: Request, res: Response) => {
    try {
        const cats = JSON.parse(JSON.stringify(ProductModel.rawAttributes.category.type));
        res.status(200).send(cats.values);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getProductsByCategory = async (req: Request, res: Response) => {
    try {
        const cats = JSON.parse(JSON.stringify(ProductModel.rawAttributes.category.type));

        const products = await ProductModel.findAll({
            where: {
                category: req.params.cat,
            },
        });

        res.status(200).json({ cats: cats.values, products: products });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const postAddProduct = async (req: Request, res: Response) => {
    try {
        let path;
        if (req.file) {
            path = req.file.path.slice(5);
        }
        await ProductModel.create({
            name: req.body.name,
            price: req.body.price,
            category: req.body.category,
            images: path,
        });
        res.status(201).json({ message: "Product added successfully!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        await ProductModel.destroy({ where: { pid: req.body.pid } });
        res.status(200).json({ message: "Product deleted successfully!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const putEditProduct = async (req: Request, res: Response) => {
    try {
        let path;
        if (req.file) {
            path = req.file.path.slice(5);
        }
        if (path) {
            await ProductModel.update(
                {
                    name: req.body.name,
                    price: req.body.price,
                    category: req.body.category,
                    images: path,
                },
                {
                    where: { pid: req.params.pid },
                }
            );
        } else {
            await ProductModel.update(
                {
                    name: req.body.name,
                    price: req.body.price,
                    category: req.body.category,
                },
                {
                    where: { pid: req.params.pid },
                }
            );
        }

        res.status(200).json({ message: "Product updated successfully!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getTotalNumberProducts = async (req: Request, res: Response) => {
    try {
        const count = await ProductModel.count();
        res.status(200).json({ count: count });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};
