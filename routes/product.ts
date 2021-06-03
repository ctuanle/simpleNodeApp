import express from 'express';
import * as productController from '../controllers/product';

const productRouter = express.Router();

/**
 * Get all products
 * /products/
 */
productRouter.get('/', productController.getAllProducts);

/**
 * Get infos of a specific product
 * /products/:id
 */
productRouter.get('/:id', productController.getProductById);


/**
 * Get N products
 * /products/page/:page
 */
productRouter.get('/page/:page', productController.getNProducts);

export default productRouter;