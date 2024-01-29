import express from "express";
import { addMember, addGroups } from "../controller/group.controller.js";

const route = express.Router();

route.post("/groups", addGroups);

route.patch("/groups/:groupId/add-members", addMember);

export default route;
