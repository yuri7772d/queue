import express from "express";
import configEnv from "../config.load.js";

const app = express();
const server = configEnv.server

import roomRouter from "./router/room.js";

import authRouter from "./router/auth.js";
import fileRouter from "./router/file.js";
import queueRouter from "./router/queue.js"
import cookieParser from "cookie-parser";
import cors from "cors"


export default  () => {
  app.use(express.json());
  app.use(cookieParser());

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );
  app.get("/", (req, res) => {
    res.status(200).json({ msg: "ok sdfsfadfgahfh" });
  });
  app.use("/auth", authRouter);
  app.use("/queue", queueRouter);
  app.use("/room", roomRouter);
  app.use("/file", fileRouter);
  app.listen(server.port, () => {
    console.log(`server start on port : ${server.port}`);
  });
};
