/**
 * Required External Modules
 */
import dotenv from "dotenv";
import express, { RequestHandler } from "express";
import cookieParser from "cookie-parser";
import http from "http";
import path from "path";

import shopRouter from "./src/routes/shop.routes";
import authRouter from "./src/routes/auth.routes";
import adminRouter from "./src/routes/admin.routes";

import authApi from "./src/api/auth.api";
import productApi from "./src/api/product.api";
import userApi from "./src/api/user.api";

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

// App views engine
app.set("view engine", "ejs");
app.set("views", "views");

// App Router
app.use("/admin", adminRouter);
app.use("/", shopRouter);
app.use("/auth", authRouter);
app.use("/resources", express.static(path.join(__dirname, "..", "data")));

// App API
app.use("/api/auth", authApi);
app.use("/api/product", productApi);
app.use("/api/user", userApi);

export default server;
