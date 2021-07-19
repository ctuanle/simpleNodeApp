/**
 * Required External Modules
 */
import dotenv from "dotenv";
import express, { RequestHandler } from "express";
import cookieParser from "cookie-parser";
import http from "http";
import path from "path";

import router from "./src/routes";
import api from "./src/api";

/**
 * App Variables
 */
const app: express.Application = express();
const server = http.createServer(app);
const PORT = process.env.PORT;
if (!PORT) {
    console.error("Please config your working environement first (file .env) : PORT");
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

// App views engine
app.set("view engine", "ejs");
app.set("views", "views");

// App Router
app.use("/admin", router.adminRouter);
app.use("/", router.shopRouter);
app.use("/auth", router.authRouter);
app.use("/resources", express.static(path.join(__dirname, "..", "data")));

// App API
app.use("/api/auth", api.authApi);
app.use("/api/product", api.productApi);
app.use("/api/user", api.userApi);
app.use("/api/room", api.roomApi);
app.use("/api/message", api.msgApi);

export default server;
