import express from 'express';
import * as productController from '../controllers/product';

const productRouter = express.Router();

/**
 * Get all products
 * /products/
 */
productRouter.get('/', productController.getAllProduct);

/**
 * Get infos of a specific product
 * /products/:id
 */
productRouter.get('/:id', productController.getProductById);


export default productRouter;