import express from 'express';
import * as msgController from '../controllers/message';
import {requireLogin} from '../middlewares/auth';

const msgRouter = express.Router();

msgRouter.get('/room/:rid', msgController.getMessageByRoom);

msgRouter.get('/:mid',  msgController.getMessageById);

msgRouter.post('/add',  msgController.postMessage);

export default msgRouter;