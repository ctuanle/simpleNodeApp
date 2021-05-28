import express from 'express';
import * as productModel from '../models/product';
import {Product} from '../types/product';

const categoryRouter = express.Router();

categoryRouter.get('/', (req, res) => {
    productModel.findAllCategories((err: Error, cats: string[]) => {
        if (err) {
            return res.status(500).json({'errorMessage': err.message});
        }
        res.render('product/categories', {
            'title' : 'Categories',
            'categories' : cats,
            'products' : []
        })
    })
})

categoryRouter.get('/:cat', (req, res) => {
    productModel.findAllCategories((err: Error, cats: string[]) => {
        if (err) {
            return res.status(500).json({'errorMessage': err.message});
        }
        productModel.findByCategory(req.params.cat, (err: Error, products: Product[]) => {
            if (err) {
                return res.status(500).json({'errorMessage': err.message});
            }
            res.render('product/categories', {
                'title' : 'Categories',
                'categories' : cats,
                'products' : products
            })
        })
    })
})

export {categoryRouter};