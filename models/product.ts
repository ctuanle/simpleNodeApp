import { BasicProduct, Product } from '../types/product';
import { db } from '../db';
import { OkPacket, RowDataPacket } from 'mysql2';

export const create = (product: BasicProduct, callback: Function) => {
    const query = "INSERT INTO products (name, price, category, images) VALUES (?, ?, ?, ?)";

    db.query(
        query,
        [product.name, product.price, product.category, product.images],
        (err, result) => {
            if (err) {
                callback(err);
            }
            const insertedId = (<OkPacket>result).insertId;
            callback(null, insertedId);
        }
    )
}

export const findOne = (productId: number, callback: Function) => {
    const query = "SELECT * FROM products WHERE id = ?";

    db.query(
        query,
        [productId],
        (err, result) => {
            if (err) {
                return callback(err);
            }
            const row = (<RowDataPacket>result)[0];
            if (row) {
                const product: Product = {
                    id: row.id,
                    name: row.name,
                    price: row.price,
                    category: row.category,
                    images: row.images
                }
                return callback(null, product);
            }
            else {
                return callback(new Error('Data not found!'));
            }

        }
    )
}

export const findAll = (callback: Function) => {
    const query = "SELECT * FROM products";

    db.query(query, (err, result) => {
        if (err) {
            return callback(err);
        }
        const rows = <RowDataPacket[]>result;
        const products: Product[] = [];
        rows.forEach(row => {
            const product: Product = {
                id: row.id,
                name: row.name,
                price: row.price,
                category: row.category,
                images: row.images
            }
            products.push(product);
        });
        callback(null, products);
    });
}

export const update = (product: Product, callback: Function) => {
    db.query("SELECT * FROM products WHERE id = ?", product.id, (err, result) => {
        if (err) {
            return callback(err);
        }
        const row = <RowDataPacket>result;
        if (row.length > 0) {
            const query = "UPDATE products SET name=?, price=?, category=?, images=? WHERE id=?";
            db.query(
                query,
                [product.name, product.price, product.category,product.images, product.id],
                (err, result) => {
                    if (err) {
                        return callback(err);
                    }
                    return callback(null);
                }
            )
        }
        else {
            return callback(new Error('Product ID not found!'));
        }
    })
}

export const deleteOne = (productId: number, callback: Function) => {
    const query = "DELETE FROM products WHERE id = ?";

    db.query(query, [productId], (err, result) => {
        if (err) {
            return callback(err);
        }
        callback(null);
    })
}

export const findAllCategories = (callback: Function) => {
    const query = "SELECT DISTINCT category from products";
    db.query(query, (err, result) => {
        if (err) {
            return callback(err);
        }
        const rows = <RowDataPacket[]> result;
        const cats: string[] = [];
        rows.forEach(row => {
            cats.push(row.category);
        })
        callback(null, cats);
    })
}

export const findAllByCategory = (callback: Function) => {
    const query = "SELECT * FROM products GROUP BY category";
    db.query(query, (err, result) => {
        if (err) {
            return callback(err);
        }
        console.log(result);
    })
}

export const findByCategory = (category: string, callback: Function) => {
    const query = "SELECT * FROM products WHERE category=?";
    db.query(query, [category], (err, result) => {
        if (err) {
            return callback(err);
        }
        const rows = <RowDataPacket[]> result;
        if (rows.length > 0) {
            const products: Product[] = [];
            rows.forEach((row) => {
                const product: Product = {
                    id: row.id,
                    name: row.name,
                    price: row.price,
                    category: row.category,
                    images: row.images
                }
                products.push(product);
            })
            return callback(null, products);
        }
        else {
            return callback(new Error('Zero product!'));
        }
    })
}