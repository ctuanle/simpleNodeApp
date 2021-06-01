import * as productModel from '../models/product';
import {BasicProduct, Product} from '../types/product';
import {Request, Response} from 'express';

export const getAllProducts = (req: Request, res: Response) => {
    productModel.findAll((err:Error, products: Product[]) => {
        if (err) {
            return res.status(500).json({'message': err.message});
        }
        res.render('admin/admin', {
            title: 'Products',
            products: products
        });
    })
}

export const getEditProduct = (req: Request, res: Response) => {
    productModel.findOne(Number(req.params.id), (err:Error, product: Product) => {
        if (err) {
            return res.status(500).json({'message': err.message});
        }
        res.render('admin/edit-product', {
            title: 'Edit Product',
            product : product,
        });
    })
}

export const getAddProduct = (req: Request, res: Response) => {
    res.render('admin/add-product', {
        title: 'Add Product',
    })
}

export const postAddProduct = (req: Request, res: Response) => {
    const newProduct: BasicProduct = req.body;

    if (req.file){
        newProduct.images = req.file.path.slice(5);
    }
    
    productModel.create(newProduct, (err: Error, productId: number) => {
        if (err) {
            return res.status(500).json({'message': err.message});
        }
        res.status(200).json({"message": "Product created successfully", "productId": productId});
    });
}

export const putUpdateProduct = (req: Request, res: Response) => {
    const product: Product = req.body;
    product.id = Number(req.params.id);
    if (req.file){
        product.images = req.file.path.slice(5);
    }
    productModel.update(product, (err: Error) => {
        if (err) {
            return res.status(500).json({'message': err.message});
        }
        res.status(200).json({'message' : 'Product updated successfully!', 'productId': product.id});
    })
}

export const deleteProduct = (req: Request, res: Response) => {
    const productId = req.body.productId;
    productModel.deleteOne(productId, (err: Error) => {
        if (err) {
            return res.status(500).json({'message': err.message})
        }
        res.status(200).json({'message' : 'Product deleted successfully!'});
    })
}
