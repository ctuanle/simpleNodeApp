import * as productModel from '../models/product';
import {Product} from '../types/product';
import {Request, Response} from 'express';

export const getAllCategories = (req: Request, res: Response) => {
    productModel.findAllCategories((err: Error, cats: string[]) => {
        if (err) {
            return res.status(500).json({'message': err.message});
        }
        res.render('product/categories', {
            'title' : 'Categories',
            'categories' : cats,
            'products' : []
        })
    })
}

export const getProductsByCategory = (req: Request, res: Response) => {
    productModel.findAllCategories((err: Error, cats: string[]) => {
        if (err) {
            return res.status(500).json({'message': err.message});
        }
        productModel.findByCategory(req.params.cat, (err: Error, products: Product[]) => {
            if (err) {
                return res.status(500).json({'message': err.message});
            }
            res.render('product/categories', {
                'title' : 'Categories',
                'categories' : cats,
                'products' : products
            })
        })
    })
}