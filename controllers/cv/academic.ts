import { Request, Response } from "express";
import CVModel from "../../models/cv";
import { handleErrors } from "../../middlewares/errorHandler";

export const updateAcademic = async (req: Request, res: Response) => {
  const academic = req.body;
  const { cvId } = req.params;
  const userId = (req as any).user?._id;

  try {
    const updateData = {
      academic,
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
      { new: true, upsert: true }
    );

    res.json({ success: true, data: cv.academic });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ success: false, errors });
  }
};

export const getAcademic = async (req: Request, res: Response) => {
  const { cvId } = req.params;

  try {
    const cv = await CVModel.findOne({ _id: cvId });
    if (!cv) return res.json({ success: false, message: "CV not found" });

    res.json({ success: true, data: cv.academic });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ success: false, errors });
  }
};
