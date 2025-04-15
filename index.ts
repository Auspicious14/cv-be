const dotenv = require("dotenv");
dotenv.config();
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
export const appRoute = express();
import router from "./routes/auth";
import cvRouter from "./routes/cv";
import guestRouter from "./routes/guest";

appRoute.use(cors());
appRoute.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow_Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
appRoute.use(express.json({ limit: "50mb" }));
appRoute.use(express.urlencoded({ limit: "50mb", extended: true }));
appRoute.use(cookieParser());
appRoute.use("/auth", router);
appRoute.use(cvRouter);
appRoute.use("/guest", guestRouter);
