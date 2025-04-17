import { Request, Response } from "express";
import { EnhancedAIService } from "../../services/ai/enhanced";
import { handleErrors } from "../../middlewares/errorHandler";

export const aiSuggestion = async (req: Request, res: Response) => {
  const { content, section } = req.body;

  try {
    const { enhanced, suggestions } = await EnhancedAIService.enhanceContent({
      content,
      section,
    });

    if (enhanced) {
      res.status(200).json({
        success: true,
        message: "AI suggestion",
        data: { enhanced, suggestions },
      });
    }
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ success: false, errors });
  }
};
