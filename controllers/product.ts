import * as productModel from '../models/product';
import {Product} from '../types/product';
import {Request, Response} from 'express';

export const getAllProduct = async (req: Request, res: Response) => {
    productModel.findAll((err:Error, products: Product[]) => {
        if (err) {
            return res.status(500).json({'errorMessage': err.message});
        }
        res.render('product/products', {
            title: 'Products',
            products: products,
        });
    })
}

export const getProductById = async (req: Request, res: Response) => {
    const productId:number = Number(req.params.id);
    productModel.findOne(productId, (err: Error, product: Product) => {
        if (err) {
            return res.status(500).json({'errorMessage': err.message});
        }
        res.render('product/productDetail', {
            title: product.name,
            product: product
        })
        //res.status(200).json({'data': product});
    })
}