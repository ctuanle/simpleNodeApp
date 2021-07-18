import * as dotenv from "dotenv";
import { Sequelize } from "sequelize";
dotenv.config();

const NODE_ENV = process.env.NODE_ENV;

const DB_NAME = NODE_ENV ? process.env.DB_TEST_NAME : process.env.DB_DEV_NAME;
const DB_USER = process.env.DB_USER;
const DB_PWD = process.env.DB_PWD;
const DB_HOST = process.env.DB_HOST;

// Check database config
if (!DB_NAME || !DB_USER || !DB_PWD || !DB_HOST) {
    console.error("Please config your working environment first (file .env): DATABASE");
    process.exit();
}

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PWD, {
    host: DB_HOST,
    port: 3306,
    dialect: "mysql",
    logging: false,
});

export const sequeSync = async (sequelize: Sequelize) => {
    try {
        await sequelize.authenticate();
        console.log("DATABASE_Authenticated: ", sequelize.getDatabaseName());

        if (NODE_ENV) {
            await sequelize.sync({ force: true });
        } else {
            await sequelize.sync({ alter: true });
        }

        console.log("DATABASE_Synchronized");
    } catch (err) {
        console.log(err);
    }
};
