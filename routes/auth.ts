import express from 'express';
import * as authController from '../controllers/auth';

const authRouter = express.Router();

/**
 * GET login page
 * /auth/login
 */
authRouter.get('/login', authController.getLogin);

/**
 * GET signup page
 * /auth/signup
 */
authRouter.get('/signup', authController.getSignup);


/**
 * GET forgot password page
 * /auth/reset
 */
authRouter.get('/forgot', authController.getForgotPassword);

/**
 * GET reset password page
 * /auth/reset
 */
authRouter.get('/reset/:uid/:token', authController.getResetPassword);

/**
 * POST a sign up request
 * /auth/signup
 */
authRouter.post('/signup', authController.postSignup);

/**
 * POST a log in request
 * /auth/login
 */
authRouter.post('/login', authController.postLogin);

/**
 * POST a log out request
 * /auth/logout
 */
authRouter.post('/logout', authController.postLogout);

/**
 * POST check if user is log in
 * /auth/check
 */
 authRouter.post('/check', authController.checkIsLogin);

/**
 * POST forgot password request
 * /auth/reset
 */
authRouter.post('/forgot', authController.postForgotPassword);

/**
 * POST reset password request
 * /auth/reset
 */
authRouter.post('/reset', authController.postResetPassword);


export default authRouter;