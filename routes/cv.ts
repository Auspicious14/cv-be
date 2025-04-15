import express from "express";
import { createCV, getUSerCV, updateCV } from "../controllers/cv";
import { createEnhancedCV, updateEnhancedCV } from "../controllers/cv/enhanced";

const cvRoute = express.Router();

// Standard CV endpoints
cvRoute.post("/cv", createCV);
cvRoute.post("/cv/:id", updateCV);
cvRoute.get("/cv/:id", getUSerCV);

// AI-enhanced CV endpoints
cvRoute.post("/cv/enhanced", createEnhancedCV);
cvRoute.post("/cv/enhanced/:id", updateEnhancedCV);

export default cvRoute;
