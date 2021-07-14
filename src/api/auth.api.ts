import express from "express";
import * as authController from "../controllers/auth.controllers";

const authApi = express.Router();

// POST /api/auth/signup : post a request to signup
authApi.post("/signup", authController.postSignup);

// POST /api/auth/login : post a request to login
authApi.post("/login", authController.postLogin);

// POST /api/auth/logout : post a request to logout
authApi.post("/logout", authController.postLogout);

// GET /api/auth/info : post a request to check if user is logined
authApi.get("/info", authController.checkInfo);

// POST /api/auth/forgot : post a request to have the right to reset password
authApi.post("/forgot", authController.postForgotPassword);

// POST /api/auth/reset : post a request to reset password
authApi.post("/reset", authController.postResetPassword);

export default authApi;