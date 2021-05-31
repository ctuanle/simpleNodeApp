import express from 'express';
import * as categoryController from '../controllers/category';

const categoryRouter = express.Router();

/**
 * get all the categories
 * /categories/
 */
categoryRouter.get('/', categoryController.getAllCategories);

/**
 * get all the products of a category
 * /categories/:cat
 */
categoryRouter.get('/:cat', categoryController.getProductsByCategory);

export default categoryRouter;