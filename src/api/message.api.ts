import express from "express";
import * as msgControllers from "../controllers/message.controllers";
import { requireRoleAdmin } from "../middlewares/auth.middlewares";

const msgApi = express.Router();

// GET /api/message/count : get number of messages
msgApi.get("/count", requireRoleAdmin, msgControllers.getTotalNumberMessages);

// GET /api/message/first15 : get 15 latest messages
msgApi.get("/latest15", requireRoleAdmin, msgControllers.get15LatestMessage);

// GET /api/message/next/:offset : get next 15 messages
msgApi.get("/next/:offset", requireRoleAdmin, msgControllers.getNext15Messages);

// POST /api/message : push a messagee
msgApi.post("/add", requireRoleAdmin, msgControllers.postMessage);

export default msgApi;