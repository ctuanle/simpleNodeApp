/**
 * Required External Modules
 */
import dotenv from 'dotenv';
import express from 'express';
import * as bodyParser from 'body-parser';
import {productRouter} from './routes/productRouter';
import {adminRouter} from './routes/adminRouter';
import {categoryRouter} from './routes/categoryRouter';
import {authRouter} from './routes/authRouter';


/**
 * App Variables
 */
const app = express();


/**
 *  App Configuration
 */
dotenv.config();
app.use(express.json());
app.use(express.urlencoded());
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static('./public'));

app.use("/products", productRouter);
app.use("/admin", adminRouter);
app.use("/categories", categoryRouter);
app.use("/auth", authRouter);

app.get('/', (req, res) => {
    res.render('index', {
        title: "Home Page",
    });
})

/**
 * Server Activation
 */
app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);   
})