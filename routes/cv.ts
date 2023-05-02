import express from "express";
import { createCV, getUSerCV, updateCV } from "../controllers/cv";

const cvRoute = express.Router();

cvRoute.post("/cv", createCV);
cvRoute.post("/cv/:id", updateCV);
cvRoute.get("/cv/:id", getUSerCV);

export default cvRoute;
