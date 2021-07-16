import express from "express";

import * as userControllers from "../controllers/user.controllers";
import { requireRoleAdmin } from "../middlewares/auth.middlewares";

const userApi = express.Router();

// GET /api/user/five : get first 5 users
userApi.get("/five", requireRoleAdmin, userControllers.get5User);

// GET /api/user/count : get number of users
userApi.get("/count", requireRoleAdmin, userControllers.getTotalNumberUsers);

// GET /api/user/:uid : get user by id
userApi.get("/:uid", requireRoleAdmin, userControllers.getUserById);

// GET /api/user/username/:username : get user by username
userApi.get("/username/:username", requireRoleAdmin, userControllers.getUserByUsername);

export default userApi;