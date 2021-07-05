import express from 'express';
import * as userController from '../controllers/user.controllers';
import { requireLogin } from '../middlewares/user_auth';

const userRouter = express.Router();

userRouter.get('/:uid', requireLogin, userController.getChatPage);

export default userRouter;