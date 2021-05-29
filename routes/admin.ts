import express from 'express';

import upload from '../middlewares/multer';
import {requireLogin} from '../middlewares/auth';
import * as adminController from '../controllers/admin';




const adminRouter = express.Router();

/**
 * GET all products page for admin
 * /admin
 */
adminRouter.get('/', adminController.getAllProducts);

/**
 * GET edit product page
 * /admin/edit/:id
 */
adminRouter.get('/edit/:id', adminController.getEditProduct);

/**
 * GET add product page
 * /admin/add
 */
adminRouter.get('/add', adminController.getAddProduct);

/**
 * POST add a new product
 * /admin/add
 */
 adminRouter.post('/add', upload.single('files'), requireLogin, adminController.postAddProduct);

/**
 * PUT update a product
 * /admin/edit/:id
 */
 adminRouter.put('/edit/:id', upload.single('files'), requireLogin, adminController.putUpdateProduct);


/**
 * DELETE a product
 * /admin/delete
 */
 adminRouter.delete('/delete', requireLogin, adminController.deleteProduct);
 
export default adminRouter;