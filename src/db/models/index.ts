import * as dotenv from "dotenv";
import { Sequelize } from "sequelize";
dotenv.config();

const NODE_ENV = process.env.NODE_ENV || "DEV";

const DB_NAME = NODE_ENV === "TEST" ? process.env.DB_TEST_NAME : process.env.DB_DEV_NAME;
const DB_USER = process.env.DB_USER;
const DB_PWD = process.env.DB_PWD;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;

// Check database config
if (!DB_NAME || !DB_USER || !DB_PWD || !DB_HOST || !DB_PORT) {
    console.error("Please config your working environment first (file .env): DATABASE");
    process.exit();
}

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PWD, {
    host: DB_HOST,
    port: parseInt(DB_PORT),
    dialect: "mysql",
    logging: false,
});

export const sequeSync = async (sequelize: Sequelize) => {
    try {
        await sequelize.authenticate();
        console.log("DATABASE_Authenticated: ", sequelize.getDatabaseName());

        if (NODE_ENV === "TEST") {
            await sequelize.sync({ alter: true });
        } else if (NODE_ENV === "DEV") {
            await sequelize.sync({ alter: true });
        }

        console.log("DATABASE_Synchronized");
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};
