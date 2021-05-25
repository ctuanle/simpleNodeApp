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
        res.render('products', {
            title: 'Products',
            products: products
        });
    })
})

/**
 * Add a new product
 */
productRouter.post('/', async (req, res) => {
    const name = req.body.name;
    const price = req.body.price;
    const category = req.body.category;
    productModel.create(name, price, category, (err: Error, productId: number) => {
        if (err) {
            return res.status(500).json({'errorMessage': err.message});
        }
        res.status(200).json({"message": "Product created successfully", "productId": productId});
    });
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
        res.render('productDetail', {
            title: product.name,
            product: product
        })
        //res.status(200).json({'data': product});
    })
})

/**
 * Update a product
 */
productRouter.put('/:id', async (req, res) => {
    const product: Product = req.body;
    product.id = Number(req.params.id);
    productModel.update(product, (err: Error) => {
        if (err) {
            return res.status(500).json({'errorMessage': err.message});
        }
        res.status(200).json({'message' : 'Product updated successfully!', 'productId': product.id});
    })
})

/**
 * Delete a product
 */
productRouter.delete('/', async (req, res) => {
    const productId = req.body.productId;
    productModel.deleteOne(productId, (err: Error) => {
        if (err) {
            return res.status(500).json({'errorMessage': err.message})
        }
        //res.status(200).json({'message' : 'Product deleted successfully!'});
        res.redirect('/admin/');
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