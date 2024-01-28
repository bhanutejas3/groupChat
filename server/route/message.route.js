import express from "express";
import { getMessages, addMessage } from "../controller/message.controller.js";

const route = express.Router();

route.get("/:userId/:openedUserId", getMessages);
route.post("/addMessage", addMessage);

export default route;
