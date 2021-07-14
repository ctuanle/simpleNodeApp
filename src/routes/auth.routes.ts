import express from "express";
import * as authController from "../controllers/auth.controllers";

const authRouter = express.Router();

/**
 * Render HTML Page
 */
// GET /auth/login : get login page
authRouter.get("/login", authController.getLogin);

// GET /auth/signup : get signup page
authRouter.get("/signup", authController.getSignup);

// GET /auth/forgot : get forgot password page
authRouter.get("/forgot", authController.getForgotPassword);

// GET /auth/:uid/:token : get reset password page
authRouter.get("/reset/:uid/:token", authController.getResetPassword);

export default authRouter;
