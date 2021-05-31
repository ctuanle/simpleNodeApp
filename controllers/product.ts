import * as productModel from '../models/product';
import {Product} from '../types/product';
import {Request, Response} from 'express';

export const getAllProduct = async (req: Request, res: Response) => {
    productModel.findAll((err:Error, products: Product[]) => {
        if (err) {
            return res.status(500).json({'message': err.message});
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
            return res.status(500).json({'message': err.message});
        }
        res.render('product/productDetail', {
            title: product.name,
            product: product
        })
        //res.status(200).json({'data': product});
    })
}

export const getNProducts = async (req: Request, res: Response) => {
    const quantity = Number(req.params.quantity) || 12;
    const page = Number(req.params.page);
    const from = (page-1) * quantity;

    productModel.findNProducts(quantity, from, (err: Error, total: number, products: Product[]) => {
        if (err) {
            return res.status(500).json({'message': err.message});
        }
        res.render('product/products', {
            title: 'Product',
            numpage: Math.ceil(total / quantity),
            products: products
        })
    })
}