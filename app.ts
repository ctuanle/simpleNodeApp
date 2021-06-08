/**
 * Required External Modules
 */
import dotenv from 'dotenv';
import express, {RequestHandler} from 'express';
import cookieParser from 'cookie-parser';
import productRouter from './routes/product';
import adminRouter from './routes/admin';
import categoryRouter from './routes/category';
import authRouter from './routes/auth';
import userRouter from './routes/user';



/**
 * App Variables
 */
const app = express();


/**
 *  App Configuration
 */
dotenv.config();
app.use(express.json() as RequestHandler);
app.use(cookieParser());
app.use(express.urlencoded({extended: false}) as RequestHandler);
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static(__dirname + '/public'));

app.use("/products", productRouter);
app.use("/admin", adminRouter);
app.use("/categories", categoryRouter);
app.use("/auth", authRouter);
app.use("/user", userRouter);
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