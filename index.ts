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
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    exposedHeaders: ["Content-Disposition"],
  })
);
console.log("ENV:", process.env.CLIENT_URL);
appRoute.use(express.json({ limit: "50mb" }));
appRoute.use(express.urlencoded({ limit: "50mb", extended: true }));
appRoute.use(cookieParser());
appRoute.get("/", (req, res) => {
  res.send("Backend is working!");
});
appRoute.use("/auth", router);
appRoute.use(cvRouter);
appRoute.use(aiSuggestionRouter);
