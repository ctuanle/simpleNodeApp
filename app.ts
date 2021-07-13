/**
 * Required External Modules
 */
import dotenv from "dotenv";
import express, { RequestHandler } from "express";
import cookieParser from "cookie-parser";
import http from "http";
import * as socketio from "socket.io";
import path from "path";

import shopRouter from "./src/routes/shop.routes";
import authRouter from "./src/routes/auth.routes";
import adminRouter from "./src/routes/admin.routes";

import { socketHandler } from "./src/controllers/socket.controllers";

/**
 * App Variables
 */
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT;
if (!PORT) {
    console.error(
        "Please config your working environement first (file .env) : PORT"
    );
    process.exit();
}

/**
 *  App Configuration
 */

dotenv.config();
app.use(express.json() as RequestHandler);
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }) as RequestHandler);
app.use(express.static(path.join(__dirname, "..", "public")));

// Server views engine
app.set("view engine", "ejs");
app.set("views", "views");

// Server Router
app.use("/admin", adminRouter);
app.use("/", shopRouter);
app.use("/auth", authRouter);
app.use("/resources", express.static(path.join(__dirname, "..", "data")));

/**
 * Socket IO
 */

const io = new socketio.Server(server);

io.on("connection", (socket: socketio.Socket) => {
    socketHandler(io, socket);
});

/**
 * Server Activation
 */
server.listen(process.env.PORT, () => {
    console.log(`SERVER___Listening on port ${process.env.PORT}`);
});
