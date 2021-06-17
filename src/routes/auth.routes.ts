import express from 'express';
import * as authController from '../controllers/auth.controllers';

const authRouter = express.Router();

// GET /auth/login : get login page
authRouter.get('/login', authController.getLogin);

// GET /auth/signup : get signup page
authRouter.get('/signup', authController.getSignup);

// GET /auth/forgot : get forgot password page
authRouter.get('/forgot', authController.getForgotPassword);

// GET /auth/:uid/:token : get reset password page
authRouter.get('/reset/:uid/:token', authController.getResetPassword);

// POST /auth/signup : post a request to signup
authRouter.post('/signup', authController.postSignup);

// POST /auth/login : post a request to login
authRouter.post('/login', authController.postLogin);

// POST /auth/logout : post a request to logout
authRouter.post('/logout', authController.postLogout);

// POST /auth/check : post a request to check if user is logined
authRouter.post('/check', authController.checkIsLogin);

// POST /auth/forgot : post a request to have the right to reset password
authRouter.post('/forgot', authController.postForgotPassword);

// POST /auth/reset : post a request to reset password
authRouter.post('/reset', authController.postResetPassword);


export default authRouter;