import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from ".";

interface ProductAttributes {
    pid: string;
    name: string;
    price: number;
    category: string;
    images?: string;
}

interface ProductCreationAttributes extends Optional<ProductAttributes, "pid"> {}

interface ProductInstance extends Model<ProductAttributes, ProductCreationAttributes>, ProductAttributes {}

export const ProductModel = sequelize.define<ProductInstance>(
    "Product",
    {
        pid: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        category: {
            type: DataTypes.ENUM,
            values: ["Uncategorized", "Book", "Phone", "Laptop"],
            defaultValue: "Uncategorized",
            allowNull: true,
        },
        images: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        tableName: "products",
    }
);
