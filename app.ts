/**
 * Required External Modules
 */
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import productRouter from './routes/product';
import adminRouter from './routes/admin';
import categoryRouter from './routes/category';
import authRouter from './routes/auth';



/**
 * App Variables
 */
const app = express();


/**
 *  App Configuration
 */
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static(__dirname + '/public'));

app.use("/products", productRouter);
app.use("/admin", adminRouter);
app.use("/categories", categoryRouter);
app.use("/auth", authRouter);
app.use('/resources', express.static(__dirname + '/data'))

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