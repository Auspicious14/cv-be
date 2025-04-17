import { Request, Response } from "express";
import { handleErrors } from "../../middlewares/errorHandler";
import CVModel from "../../models/cv";

export const updateExperience = async (req: Request, res: Response) => {
  const { experience } = req.body;
  const { cvId } = req.params;
  const userId = (req as any).user?._id;

  try {
    const updateData = {
      experience,
      ...(userId
        ? { userId }
        : {
            isGuestCV: true,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          }),
    };

    const cv = await CVModel.findOneAndUpdate(
      userId ? { userId } : { _id: cvId },
      { $set: updateData },
      { new: true }
    );

    if (!userId && !cv?.isGuestCV) {
      return res.json({ success: false, message: "CV not found" });
    }

    res.json({ success: true, data: cv?.experience });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ success: false, errors });
  }
};
export const getExperience = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const cv = await CVModel.findOne({ userId });
    if (!cv) return res.json({ success: false, message: "CV not found" });

    res.json({ success: true, data: cv.experience });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ success: false, errors });
  }
};
