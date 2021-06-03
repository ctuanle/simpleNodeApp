// import * as productModel from '../models/product';
// import {BasicProduct, Product} from '../types/product';
import {Request, Response} from 'express';

import {User} from '../db/models/user';
import {Product} from '../db/models/product';

export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.findAll({
            attributes: ['id', 'name', 'price', 'category', 'images'],
            raw : true
        })
        res.render('admin/admin', {
            title: 'Products',
            products: products
        });
    }
    catch (err) {
        res.status(500).json({'message': err.message});
    }
}

export const getEditProduct = async (req: Request, res: Response) => {
    try {
        const product = await Product.findOne({where: {id: req.params.id}});
        if (product){
            res.render('admin/edit-product', {
                title: 'Edit Product',
                product : product,
            });
        }
        else{
            res.status(500).json({'message': 'Product not found!'});
        }
    }
    catch (err) {
        res.status(500).json({'message': err.message});
    }
}


export const getAddProduct = (req: Request, res: Response) => {
    try {
        res.render('admin/add-product', {
            title: 'Add Product',
        })
    }
    catch (err) {
        res.status(500).json({'message': err.message});
    }
}

export const postAddProduct = async (req: Request, res: Response) => {
    try {
        var path = undefined;
        if (req.file){
            path = req.file.path.slice(5)
        }
        await Product.create({
            name: req.body.name,
            price: req.body.price,
            category: req.body.category,
            images: path
        });
        res.status(201).json({'message' : 'Product added successfully!'});
    }
    catch (err) {
        res.status(500).json({'message': err.message});
    }
}

export const putUpdateProduct = async (req: Request, res: Response) => {
    try {
        var path = undefined;
        if (req.file){
            path = req.file.path.slice(5)
        }
        await Product.update({
            name: req.body.name,
            price: req.body.price,
            category: req.body.category,
            images: path
        }, {
            where: {id: req.params.id}
        })
        res.status(200).json({'message' : 'Product updated successfully!'});
    }
    catch (err) {
        res.status(500).json({'message': err.message});
    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        await Product.destroy({where: {id: req.body.productId}});
        res.status(200).json({'message' : 'Product deleted successfully!'});
    }
    catch (err) {
        res.status(500).json({'message': err.message});
    }
}
