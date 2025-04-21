const dotenv = require("dotenv");
dotenv.config();
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
export const appRoute = express();
import router from "./routes/auth";
import cvRouter from "./routes/cv";
import aiSuggestionRouter from "./routes/suggestion";

appRoute.use(
  cors({
    origin: "https://cv-craft-silk.vercel.app" || "http://localhost:3000",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    exposedHeaders: ["Content-Disposition"],
  })
);

appRoute.use(express.json({ limit: "50mb" }));
appRoute.use(express.urlencoded({ limit: "50mb", extended: true }));
appRoute.use(cookieParser());
appRoute.use("/auth", router);
appRoute.use(cvRouter);
appRoute.use(aiSuggestionRouter);
