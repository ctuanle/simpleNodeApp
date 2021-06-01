import express from 'express';

import upload from '../middlewares/multer';
import {requireCookie} from '../middlewares/auth';
import * as adminController from '../controllers/admin';


const adminRouter = express.Router();

/**
 * GET all products page for admin
 * /admin
 */
adminRouter.get('/', requireCookie, adminController.getAllProducts);

/**
 * GET edit product page
 * /admin/edit/:id
 */
adminRouter.get('/edit/:id', requireCookie, adminController.getEditProduct);

/**
 * GET add product page
 * /admin/add
 */
adminRouter.get('/add', requireCookie, adminController.getAddProduct);

/**
 * POST add a new product
 * /admin/add
 */
 adminRouter.post('/add', upload.single('files'), requireCookie, adminController.postAddProduct);

/**
 * PUT update a product
 * /admin/edit/:id
 */
 adminRouter.put('/edit/:id', upload.single('files'), requireCookie, adminController.putUpdateProduct);


/**
 * DELETE a product
 * /admin/delete
 */
 adminRouter.delete('/delete', requireCookie, adminController.deleteProduct);
 
export default adminRouter;