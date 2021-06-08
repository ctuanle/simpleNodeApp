import express from 'express';

import upload from '../middlewares/multer';
import {requireAdmin} from '../middlewares/auth';
import * as adminController from '../controllers/admin';


const adminRouter = express.Router();

/**
 * GET all products page for admin
 * /admin
 */
adminRouter.get('/', requireAdmin, adminController.getAllProducts);

/**
 * GET edit product page
 * /admin/edit/:id
 */
adminRouter.get('/edit/:id', requireAdmin, adminController.getEditProduct);

/**
 * GET add product page
 * /admin/add
 */
adminRouter.get('/add', requireAdmin, adminController.getAddProduct);

/**
 * POST add a new product
 * /admin/add
 */
 adminRouter.post('/add', upload.single('files'), requireAdmin, adminController.postAddProduct);

/**
 * PUT update a product
 * /admin/edit/:id
 */
 adminRouter.put('/edit/:id', upload.single('files'), requireAdmin, adminController.putUpdateProduct);


/**
 * DELETE a product
 * /admin/delete
 */
 adminRouter.delete('/delete', requireAdmin, adminController.deleteProduct);
 
export default adminRouter;