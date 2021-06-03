import {Request, Response} from 'express';
import {Product} from '../db/models/product';
import {Sequelize} from 'sequelize';

export const getAllCategories = async (req: Request, res: Response) => {
    try {
        const cats = await Product.findAll({
            attributes: [
                [Sequelize.fn('DISTINCT', Sequelize.col('category')), 'category']
            ]
        });
        if (cats.length > 0) {
            res.render('product/categories', {
                'title' : 'Categories',
                'categories' : cats.map(cat => cat.getDataValue('category')),
                'products' : []
            })
        }
        else {
            return res.status(500).json({'message': 'No category!'});
        }
    }
    catch (err) {
        res.status(500).json({'message': err.message});
    }
}


export const getProductsByCategory = async (req: Request, res: Response) => {
    try {
        const cats = await Product.findAll({
            attributes: [
                [Sequelize.fn('DISTINCT', Sequelize.col('category')), 'category']
            ]
        });

        const products = await Product.findAll({
            where: {
                category: req.params.cat
            }
        });
        if (products.length > 0) {
            res.render('product/categories', {
                'title' : 'Categories',
                'categories' : cats.map(cat => cat.getDataValue('category')),
                'products' : products
            })
        }
        else {
            res.status(500).json({'message' : 'No product!'});
        }
    }
    catch (err) {
        res.status(500).json({'message': err.message});
    }
}