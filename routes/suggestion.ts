import express from "express";
import { aiSuggestion } from "../controllers/suggestions";

const suggestionRoute = express.Router();

suggestionRoute.post("ai/suggestion", aiSuggestion);

export default suggestionRoute;
