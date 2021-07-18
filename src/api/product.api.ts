import express from "express";

import upload from "../middlewares/multer";
import * as productControllers from "../controllers/product.controllers";
import { requireRoleAdmin } from "../middlewares/auth.middlewares";

const productApi = express.Router();

// GET /api/product/:id : get a product by ID
productApi.get("/:pid", productControllers.getProductById);

// GET /api/product/page/:page: get 12 products
productApi.get("/page/:page", productControllers.getNProduct);

// GET /api/product/category : get all categories
productApi.get("/category/all", productControllers.getAllCategories);

// GET /api/product/category/:cat : get products by category
productApi.get("/category/:cat", productControllers.getProductsByCategory);

// POST /api/product/add : post add a product
productApi.post("/add", requireRoleAdmin, upload.single("files"), productControllers.postAddProduct);

// DELETE /api/product/:pid : delete a product
productApi.delete("/:pid", requireRoleAdmin, productControllers.deleteProduct);

// PUT /api/product/:pid : update a product
productApi.put("/:pid", requireRoleAdmin, upload.single("files"), productControllers.putEditProduct);

// GET /api/product/count : count all products
productApi.get("/count/all", requireRoleAdmin, productControllers.getTotalNumberProducts);

export default productApi;
