import { Router } from "express";
import { createGuestCV, getGuestCV } from "../controllers/cv/guest";

const router = Router();

router.post("/cv", createGuestCV);
router.get("/cv/:id", getGuestCV);

export default router;
