import express from "express";
import { createCV, updateCV, getUSerCV } from "../controllers/cv/user";
import {
  createEnhancedCV,
  updateEnhancedCV,
} from "../controllers/cv/user/enhanced";
import { getCV } from "../controllers/cv/cv";
import { getAcademic, updateAcademic } from "../controllers/cv/academic";
import {
  getCertificate,
  updateCertificate,
} from "../controllers/cv/certificate";
import { getExperience, updateExperience } from "../controllers/cv/experience";
import {
  createPersonalInfo,
  getPersonalInfo,
} from "../controllers/cv/personal";

const cvRoute = express.Router();

// Standard CV endpoints
cvRoute.post("/cv", createCV);
cvRoute.post("/cv/:id", updateCV);
cvRoute.get("/cv/:id", getUSerCV);

// AI-enhanced CV endpoints
cvRoute.post("/cv/enhanced", createEnhancedCV);
cvRoute.post("/cv/enhanced/:id", updateEnhancedCV);

// Section-specific routes
cvRoute.post("/cv/personal", createPersonalInfo);
cvRoute.get("/cv/:cvId/personal", getPersonalInfo);
cvRoute.put("/cv/:cvId/academic", updateAcademic);
cvRoute.get("/cv/:cvId/academic", getAcademic);
cvRoute.put("/cv/:cvId/certificate", updateCertificate);
cvRoute.get("/cv/:cvId/certificate", getCertificate);
cvRoute.put("/cv/:cvId/experience", updateExperience);
cvRoute.get("/cv/:cvId/experience", getExperience);
cvRoute.get("/cv/:cvId", getCV);

export default cvRoute;
