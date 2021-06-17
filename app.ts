/**
 * Required External Modules
 */
import dotenv from 'dotenv';
import express, {RequestHandler} from 'express';
import cookieParser from 'cookie-parser';
import http from 'http';
import * as socketio from 'socket.io';
import path from 'path';


import productRouter from './src/routes/product.routes';
import categoryRouter from './src/routes/category.routes';
import authRouter from './src/routes/auth.routes';
import roomRouter from './src/routes/room';
import msgRouter from './src/routes/message';
import adminRouter from './src/routes/admin.routes';



/**
 * App Variables
 */
const app = express();
const server = http.createServer(app);



/**
 *  App Configuration
 */
dotenv.config();
app.use(express.json() as RequestHandler);
app.use(cookieParser());
app.use(express.urlencoded({extended: false}) as RequestHandler);
app.use(express.static(path.join(__dirname, '..' , 'public')));

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use("/products", productRouter);
app.use("/admin", adminRouter);
app.use("/categories", categoryRouter);
app.use("/auth", authRouter);
app.use("/room", roomRouter);
app.use("/msg", msgRouter);
app.use('/resources', express.static(path.join(__dirname, '..', 'data')));

app.get('/', (req, res) => {
    res.render('index', {
        title: "Home Page",
    });
})


/**
 * Server Activation
 */
server.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);   
})

const io = require('socket.io')(server);


io.on('connection', function(socket:socketio.Socket) {
    console.log('a user connected');
    console.log(socket.id);
    socket.on('message', function(message:string) {
        console.log(message);
        socket.emit('message', message);
    });
    
})