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
);


const main = async  () => {
    try {
        await sequelize.authenticate();
        console.log('Authenticated');
        await sequelize.sync({alter: true});
        console.log('Sync done');
    }
    catch (err) {
        console.log(err);
    }
}
main();