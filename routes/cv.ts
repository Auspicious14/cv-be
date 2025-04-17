import express from "express";

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
