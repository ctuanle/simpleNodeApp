// src/routes/product.routes.ts
// Public routes related to products

import express from 'express';
import * as productController from '../controllers/product.controllers';

const productRouter = express.Router();

//GET /product/:pid : get detail of a product
productRouter.get('/:pid', productController.getProductById);

//GET /page/:page : get (:page)th page of products
productRouter.get('/page/:page', productController.getNProducts);


export default productRouter;