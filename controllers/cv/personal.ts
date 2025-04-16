import { Request, Response } from "express";
import CVModel from "../../models/cv";
import { handleErrors } from "../../middlewares/errorHandler";
import { upLoadFile } from "../../middlewares/file";

export const createPersonalInfo = async (req: Request, res: Response) => {
  const { personalInfo } = req.body;
  const userId = (req as any).user?._id;

  try {
    let imageData = personalInfo.image;
    if (imageData?.uri) {
      const { uri, name, type } = imageData;
      const fileUrl = await upLoadFile(uri, name);
      imageData = { uri: fileUrl, name, type };
    }

    const createData = {
      personalInformation: {
        ...personalInfo,
        image: imageData,
      },
      ...(userId
        ? { userId }
        : {
            isGuestCV: true,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          }),
    };

    const cv = await CVModel.create(createData);
    res.json({ success: true, data: cv.personalInformation });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ success: false, errors });
  }
};

export const updatePersonalInfo = async (req: Request, res: Response) => {
  const { personalInfo } = req.body;
  const { cvId } = req.params;
  const userId = (req as any).user?._id;

  try {
    let imageData = personalInfo.image;
    if (imageData?.uri) {
      const { uri, name, type } = imageData;
      const fileUrl = await upLoadFile(uri, name);
      imageData = { uri: fileUrl, name, type };
    }

    const updateData = {
      personalInformation: {
        ...personalInfo,
        image: imageData,
      },
      ...(userId
        ? { userId }
        : {
            isGuestCV: true,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          }),
    };

    const cv = await CVModel.findByIdAndUpdate(
      userId ? { userId } : { _id: cvId },
      { $set: updateData },
      { new: true }
    );

    if (!userId && !cv?.isGuestCV) {
      return res.json({ success: false, message: "Guest CV not found" });
    }

    res.json({ success: true, data: cv?.personalInformation });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ success: false, errors });
  }
};

export const getPersonalInfo = async (req: Request, res: Response) => {
  const { cvId } = req.params;

  try {
    const cv = await CVModel.findById(cvId);
    if (!cv?.isGuestCV && !(req as any).user) {
      return res.json({ success: false, message: "Guest CV not found" });
    }
    if (!cv || (cv.isGuestCV && !(req as any).user))
      return res.json({ success: false, message: "CV not found" });
    if (!cv) return res.json({ success: false, message: "CV not found" });

    res.json({ success: true, data: cv.personalInformation });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ success: false, errors });
  }
};
