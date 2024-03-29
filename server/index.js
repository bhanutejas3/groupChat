import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import http from "http";
import { Server } from "socket.io";

import userRoute from "./route/user.route.js";
import messageRoute from "./route/message.route.js";
import groupRoute from "./route/group.route.js";
import { requireAuth } from "./middleware/auth.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
    methods: ["GET", "PUT", "POST"],
  })
);

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("chat message", (msg) => {
    console.log("Message:", msg);

    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

const MongoStoreInstance = MongoStore.create({
  mongoUrl: process.env.MONGO,
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStoreInstance,
    cookie: {
      secure: false,
      path: "/",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use("/api/user", userRoute);
app.use("/api/message", requireAuth, messageRoute);
app.use("/api/group_message", requireAuth, groupRoute);

server.listen(3000, () => {
  console.log("Connected to port 3000");
});

app.use((err, req, res, next) => {
  const message = err.message || "Internal server error";
  const status = err.status || 500;

  if (err.name === "MongoError") {
    if (err.code === 11000) {
      message = "Duplicate entry, please choose a different value.";
      status = 400;
    } else {
      message = "MongoDB error occurred.";
    }
  }

  res.status(status).json({
    message,
    status,
  });
});
