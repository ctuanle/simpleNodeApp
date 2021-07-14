// src/routes/product.routes.ts
// Protected routes for ADMIN

import express from "express";

import upload from "../middlewares/multer";
import { requireRoleAdmin } from "../middlewares/auth.middlewares";
import * as adminController from "../controllers/admin.controllers";

const adminRouter = express.Router();

//GET / : get index page of Admin Board
adminRouter.get("/", requireRoleAdmin, adminController.getHomepageForAdmin);

//GET /admin/product/add : get add product page
adminRouter.get(
    "/product/add",
    requireRoleAdmin,
    adminController.getAddProduct
);

// POST /admin/product/add : add product
adminRouter.post(
    "/product/add",
    requireRoleAdmin,
    upload.single("files"),
    adminController.postAddProduct
);

// GET /admin/product/:pid : get detail (edit) page of a product
adminRouter.get(
    "/product/:pid",
    requireRoleAdmin,
    adminController.getEditProduct
);

// POST /admin/product/:pid : update a product
adminRouter.put(
    "/product/:pid",
    requireRoleAdmin,
    upload.single("files"),
    adminController.putEditProduct
);

// DELETE /admin/product/:pid : delete a product
adminRouter.delete(
    "/product/:pid",
    requireRoleAdmin,
    adminController.deleteProduct
);

// GET /admin/products : get all-products-page
adminRouter.get(
    "/products/:page",
    requireRoleAdmin,
    adminController.getAllProductsPage
);

// GET /admin/users : get all-users page
adminRouter.get(
    "/users/:page",
    requireRoleAdmin,
    adminController.getAllUsersPage
);

// GET /messages : get rooms page
adminRouter.get("/messages", requireRoleAdmin, adminController.getRoomsPage);

// GET /messages/:uid get messages page
adminRouter.get(
    "/messages/:uid",
    requireRoleAdmin,
    adminController.getMessagesPage
);

// GET /messages/:uid/:offset get next 15 message
adminRouter.get(
    "/messages/:uid/:offset",
    requireRoleAdmin,
    adminController.getNextMessages
);

export default adminRouter;
