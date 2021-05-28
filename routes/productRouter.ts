import express from 'express';
import * as productModel from '../models/product';
import {Product} from '../types/product';

const productRouter = express.Router();

/**
 * Get all products
 */
productRouter.get('/', async (req, res) => {
    productModel.findAll((err:Error, products: Product[]) => {
        if (err) {
            return res.status(500).json({'errorMessage': err.message});
        }
        res.render('product/products', {
            title: 'Products',
            products: products,
        });
    })
})

/**
 * Get infos of a specific product
 */
productRouter.get('/:id', async (req, res) => {
    const productId:number = Number(req.params.id);
    productModel.findOne(productId, (err: Error, product: Product) => {
        if (err) {
            return res.status(500).json({'errorMessage': err.message});
        }
        res.render('product/productDetail', {
            title: product.name,
            product: product
        })
        //res.status(200).json({'data': product});
    })
})


/**
 * Get all products of a category
 */
productRouter.get('/category/:category', async (req, res) => {
    const category = req.params.category;
    productModel.findByCategory(category, (err: Error, products: Product[]) => {
        if (err) {
            res.status(500).json({'errorMessage' : err.message});
        }
        res.status(200).json({'data' : products});
    })
})

export {productRouter};