import express from 'express';
import * as userController from '../controllers/user';
import {requireLogin} from '../middlewares/auth';

const userRouter = express.Router();

userRouter.get('/:uid', requireLogin, userController.getUserPage);

export default userRouter;