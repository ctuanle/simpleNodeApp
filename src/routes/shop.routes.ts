import express from "express";
import * as shopControllers from "../controllers/shop.controllers";
import { requireRoleUser, requireNoThing } from "../middlewares/auth.middlewares";

const shopRouter = express.Router();

// GET / : get home page
shopRouter.get("/", requireNoThing, shopControllers.getHomePage);

// GET /product/:pid : get detail of a product
shopRouter.get("/product/:pid", requireNoThing, shopControllers.getProductById);

// GET /page/:page : get (:page)th page of products
shopRouter.get("/product/page/:page", requireNoThing, shopControllers.getNProducts);

// GET /category : get all the categories
shopRouter.get("/category", requireNoThing, shopControllers.getAllCategories);

// GET /category/:cat : get all products of (:cat)
shopRouter.get("/category/:cat", requireNoThing, shopControllers.getProductsByCategory);

// GET /message/:uid : get messages page
shopRouter.get("/message/:uid", requireRoleUser, shopControllers.getMessagesPage);

export default shopRouter;
