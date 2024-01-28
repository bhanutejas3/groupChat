import express from "express";
import {
  createUser,
  findUser,
  allUsers,
} from "../controller/user.controller.js";
import verifyToken from "../middleware/token.js";

const route = express.Router();

route.post("/addUser", createUser);
route.post("/getUser", findUser);
route.get("/allUser", verifyToken, allUsers);

export default route;
