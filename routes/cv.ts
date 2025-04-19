import express from "express";

import { generatePDF, getCV } from "../controllers/cv/cv";
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
import { getSkill, updateSkill } from "../controllers/cv/skill";
import { getLanguage, updateLanguage } from "../controllers/cv/language";

const cvRoute = express.Router();

// Section-specific routes
cvRoute.post("/cv/personal", createPersonalInfo);
cvRoute.get("/cv/:cvId/personal", getPersonalInfo);
cvRoute.put("/cv/:cvId/academic", updateAcademic);
cvRoute.get("/cv/:cvId/academic", getAcademic);
cvRoute.put("/cv/:cvId/certificate", updateCertificate);
cvRoute.get("/cv/:cvId/certificate", getCertificate);
cvRoute.put("/cv/:cvId/experience", updateExperience);
cvRoute.get("/cv/:cvId/experience", getExperience);
cvRoute.put("/cv/:cvId/skill", updateSkill);
cvRoute.get("/cv/:cvId/skill", getSkill);
cvRoute.put("/cv/:cvId/language", updateLanguage);
cvRoute.get("/cv/:cvId/language", getLanguage);
cvRoute.get("/cv/:cvId", getCV);
cvRoute.post("/cv/generate", generatePDF);

export default cvRoute;
