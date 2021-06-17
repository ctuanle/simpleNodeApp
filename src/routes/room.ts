import express from 'express';
import * as roomController from '../controllers/room';
import {requireLogin} from '../middlewares/auth';

const roomRouter = express.Router();

roomRouter.get('/',  roomController.getAllRooms);

roomRouter.get('/:rid', roomController.getRoomById);

roomRouter.post('/add',  roomController.postAddRoom);

export default roomRouter;