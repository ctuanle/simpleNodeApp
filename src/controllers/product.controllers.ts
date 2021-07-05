import {Request, Response} from 'express';
import {Product} from '../db/models/product';

export const getProductById = async (req: Request, res: Response) => {
    try {
        const product = await Product.findOne({
            attributes: ['id', 'name', 'price', 'category', 'images'],
            where: {id : req.params.pid},
        });
        if (product) {
            res.render('product/productDetail', {
                title: product.getDataValue('name'),
                product: product
            })
        }
        else {
            res.status(500).json({'message' : 'Product not found'});
        }
        
    }
    catch (err) {
        res.status(500).json({'message': err.message});
    }
}

export const getNProducts = async (req: Request, res: Response) => {
    try {
        const limit:number = 12;
        
        if (Number(req.params.page) <= 0){
            return res.status(500).json({'message' : 'Product not found'});
        }
        
        const offset:number = (Number(req.params.page) - 1) * 12;

        const total = await Product.count();

        const products = await Product.findAndCountAll({
            attributes: ['id', 'name', 'price', 'category', 'images'],
            offset : offset,
            limit : limit,
            raw: true
        });

        if (products.count > 0) {
            res.render('product/products', {
                title: 'Product',
                numpage: Math.ceil(total / limit),
                products: products.rows
            })
        }
        else {
            res.status(500).json({'message' : 'Product not found'});
        }
    }
    catch (err) {
        res.status(500).json({'message': err.message});
    }
}

// export const getAllProducts = async (req: Request, res: Response) => {
//     try {
//         const products = await Product.findAll({
//             attributes: ['id', 'name', 'price', 'category', 'images'],
//             raw : true
//         });
//         console.log('im here')
//         res.render('product/products', {
//             title : 'Products',
//             products : products,
//             numpage : 2
//         })
//     }
//     catch (err) {
//         res.status(500).json({'message' : err.message});
//     }
    
// }