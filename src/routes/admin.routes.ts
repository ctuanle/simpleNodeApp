// src/routes/product.routes.ts
// Protected routes for ADMIN

import express from 'express';

import upload from '../middlewares/multer';
import {requireAdmin} from '../middlewares/ad_auth';
import * as adminController from '../controllers/admin.controllers';


const adminRouter = express.Router();

// GET /admin/info : GET admin's info
adminRouter.get('/info', adminController.getInfoAdmin);

//GET / : get index page of Admin Board
adminRouter.get('/',requireAdmin, adminController.getHomepageForAdmin);

// GET /admin/login : get login page for admin
adminRouter.get('/login', adminController.getLoginForAdmin);

// POST /admin/login : login
adminRouter.post('/login', adminController.postLoginForAdmin);

// POST /admin/logou : logout
adminRouter.post('/logout', requireAdmin, adminController.postLogoutForAdmin);

//GET /admin/product/add : get add product page
adminRouter.get('/product/add', requireAdmin, adminController.getAddProduct);

// POST /admin/product/add : add product
adminRouter.post('/product/add', requireAdmin, upload.single('files'), adminController.postAddProduct);

// GET /admin/product/:pid : get detail (edit) page of a product
adminRouter.get('/product/:pid', requireAdmin, adminController.getEditProduct);

// POST /admin/product/:pid : update a product
adminRouter.put('/product/:pid', requireAdmin, upload.single('files'), adminController.putEditProduct);

// DELETE /admin/product/:pid : delete a product
adminRouter.delete('/product/:pid', requireAdmin, adminController.deleteProduct);

// GET /admin/products : get all-products-page
adminRouter.get('/products/:page', requireAdmin, adminController.getAllProductsPage);

// GET /admin/users : get all-users page
adminRouter.get('/users/:page', requireAdmin, adminController.getAllUsersPage);

// GET /messages : get rooms page 
adminRouter.get('/messages', requireAdmin, adminController.getRoomsPage);

// GET /messages/:uid get messages page
adminRouter.get('/messages/:uid', requireAdmin, adminController.getMessagesPage);

// GET /messages/:uid/:offset get next 15 message
adminRouter.get('/messages/:uid/:offset', requireAdmin, adminController.getNextMessages);

export default adminRouter;