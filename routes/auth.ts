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
 * POST a sign up request
 * /auth/signup
 */
authRouter.post('/signup', authController.postSignup);

/**
 * POST a log in request
 * /auth/login
 */
authRouter.post('/login', authController.postLogin);

export default authRouter;