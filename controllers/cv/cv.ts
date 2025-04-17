import { Request, Response } from "express";
import CVModel from "../../models/cv";
import { handleErrors } from "../../middlewares/errorHandler";

export const getCV = async (req: Request, res: Response) => {
  const { cvId } = req.params;
  const userId = (req as any).user?._id;
  const id = userId || cvId;

  try {
    const cv = await CVModel.findOne(id).select("-__v -_id -userId");
    if (!cv) return res.json({ success: false, message: "CV not found" });

    res.json({
      success: true,
      data: {
        personalInformation: cv.personalInformation,
        academic: cv.academic,
        certificate: cv.certificate,
        experience: cv.experience,
        skill: cv.skill,
      },
    });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ success: false, errors });
  }
};

export const getGuestCVSections = async (req: Request, res: Response) => {
  const { cvId } = req.params;

  try {
    const cv = await CVModel.findById(cvId).select("-__v -_id -userId");
    if (!cv?.isGuestCV)
      return res.json({ success: false, message: "Guest CV not found" });

    res.json({
      success: true,
      data: {
        personalInformation: cv.personalInformation,
        academic: cv.academic,
        certificate: cv.certificate,
        experience: cv.experience,
        skill: cv.skill,
      },
    });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ success: false, errors });
  }
};
