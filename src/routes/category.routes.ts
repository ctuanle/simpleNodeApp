import express from 'express';
import * as categoryController from '../controllers/category.controllers';

const categoryRouter = express.Router();

// GET /category : get all the categories
categoryRouter.get('/', categoryController.getAllCategories);

// GET /category/:cat : get all products of (:cat)
categoryRouter.get('/:cat', categoryController.getProductsByCategory);

export default categoryRouter;