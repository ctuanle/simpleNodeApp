import * as dotenv from "dotenv";
import {Sequelize} from "sequelize";
dotenv.config();

const db_name = process.env.DB_NAME || '';
const db_user = process.env.DB_USER || '';
const db_pwd = process.env.DB_PWD   || '';
const db_host = process.env.DB_HOST || 'localhost';

export const sequelize = new Sequelize(
    db_name,
    db_user,
    db_pwd,
    {
        host: db_host,
        port: 3306,
        dialect: 'mysql',
        logging : false
    }
)

sequelize.authenticate()
    .then(() => {
        console.log('Connection to database has been established successfully.')
    })
    .catch((error) => {
        console.error('Unable to connect to the database:', error);
    })
