import express from 'express';
import * as productModel from '../models/product';
import {Product} from '../types/product';
import {verifyToken} from '../middlewares/auth';

const adminRouter = express.Router();

/**
 * get all products page
 */
adminRouter.get('/', (req, res) => {
    productModel.findAll((err:Error, products: Product[]) => {
        if (err) {
            return res.status(500).json({'errorMessage': err.message});
        }
        res.render('admin', {
            title: 'Products',
            products: products
        });
    })
})

/**
 * get edit product page
 */
adminRouter.get('/edit/:id', (req, res) => {
    productModel.findOne(Number(req.params.id), (err:Error, product: Product) => {
        if (err) {
            return res.status(500).json({'errorMessage': err.message});
        }
        res.render('edit-product', {
            title: 'Edit Product',
            product : product
        });
    })
})

/**
 * get add product page
 */
adminRouter.get('/add', (req, res) => {
    res.render('add-product', {
        title: 'Add Product',
    })
})
export {adminRouter};