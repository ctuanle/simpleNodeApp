import {Model, DataTypes, Optional} from 'sequelize';
import {sequelize} from '.';

interface Product {
    id: number,
    name: string,
    price: number,
    category: string,
    images?: string,
}

interface BasicProduct extends Optional<Product, 'id'> {}

interface ProductInstance extends Model<Product, BasicProduct> {}

export const Product = sequelize.define<ProductInstance>('Product', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name : {
        type: DataTypes.STRING,
        allowNull: false
    },
    price : {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    category : {
        type: DataTypes.STRING,
        allowNull: false
    },
    images : {
        type: DataTypes.STRING,
        allowNull: true
    }
},  {
    tableName: 'products'
});

