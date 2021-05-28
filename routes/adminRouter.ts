import express from 'express';
import * as productModel from '../models/product';
import {BasicProduct, Product} from '../types/product';
import {requireLogin} from '../middlewares/auth';
import multer from 'multer';

const storage = multer.diskStorage({
    destination : 'public/images/',
    filename : function(req, file, cb) {
        cb(null, Date.now() +'-'+ file.originalname);
    }
})

const upload = multer({storage: storage});

const adminRouter = express.Router();

/**
 * get all products page
 */
adminRouter.get('/', async (req, res) => {
    productModel.findAll((err:Error, products: Product[]) => {
        if (err) {
            return res.status(500).json({'errorMessage': err.message});
        }
        res.render('admin/admin', {
            title: 'Products',
            products: products
        });
    })
})

/**
 * get edit product page
 */
adminRouter.get('/edit/:id', async (req, res) => {
    productModel.findOne(Number(req.params.id), (err:Error, product: Product) => {
        if (err) {
            return res.status(500).json({'errorMessage': err.message});
        }
        res.render('admin/edit-product', {
            title: 'Edit Product',
            product : product,
        });
    })
})

/**
 * get add product page
 */
adminRouter.get('/add', async (req, res) => {
    res.render('admin/add-product', {
        title: 'Add Product',
    })
})

/**
 * Add a new product
 */
 adminRouter.post('/add', upload.single('files'), requireLogin, async (req, res) => {
    const newProduct: BasicProduct = req.body;

    if (req.file){
        newProduct.images = req.file.path;
    }
    
    productModel.create(newProduct, (err: Error, productId: number) => {
        if (err) {
            return res.status(500).json({'errorMessage': err.message});
        }
        //res.status(200).json({"message": "Product created successfully", "productId": productId});
        res.redirect('/admin');
    });
})

/**
 * Update a product
 */
 adminRouter.put('/edit/:id', upload.single('files'), requireLogin, async (req, res) => {
    const product: Product = req.body;
    product.id = Number(req.params.id);
    if (req.file){
        product.images = req.file.path;
    }
    console.log(product);
    productModel.update(product, (err: Error) => {
        if (err) {
            return res.status(500).json({'errorMessage': err.message});
        }
        res.status(200).json({'message' : 'Product updated successfully!', 'productId': product.id});
    })
})


/**
 * Delete a product
 */
 adminRouter.delete('/delete', requireLogin, async (req, res) => {
    const productId = req.body.productId;
    productModel.deleteOne(productId, (err: Error) => {
        if (err) {
            return res.status(500).json({'errorMessage': err.message})
        }
        //res.status(200).json({'message' : 'Product deleted successfully!'});
        res.redirect('/admin/');
    })
})
export {adminRouter};