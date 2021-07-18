import express from "express";
import * as roomControllers from "../controllers/room.controllers";
import { requireRoleAdmin } from "../middlewares/auth.middlewares";

const roomApi = express.Router();

// GET /api/room/five : get first 5 rooms
roomApi.get("/five", requireRoleAdmin, roomControllers.getFirst5Rooms);

// GET /api/room/all : get all romms
roomApi.get("/all", requireRoleAdmin, roomControllers.getAllRooms);

// GET /api/room/:uid : get room by uid
roomApi.get("/:uid", requireRoleAdmin, roomControllers.getRoomByUid);

// GET /api/room/id/:rid : get room by rid
roomApi.get("/id/:rid", requireRoleAdmin, roomControllers.getRoomById);

// POST /api/room : add a room
roomApi.post("/add", requireRoleAdmin, roomControllers.postAddRoom);

// PUT /api/room/update/read : update read status of room
roomApi.put("/update/read", requireRoleAdmin, roomControllers.putUpdateRead);

// PUT /api/room/update/lastMsg : update last message of room
roomApi.put("/update/lastMsg", requireRoleAdmin, roomControllers.putUpdateLastMsg);

export default roomApi;
