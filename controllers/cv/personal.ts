import { Request, Response } from "express";
import mongoose from "mongoose";
import CVModel from "../../models/cv";
import { handleErrors } from "../../middlewares/errorHandler";
import { upLoadFile } from "../../middlewares/file";

export const createPersonalInfo = async (req: Request, res: Response) => {
  const start = Date.now();

  const { image, ...values } = req.body;

  let userId: string | undefined = (req as any).user?._id;

  if (!mongoose.Types.ObjectId.isValid(userId as string)) {
    userId = undefined;
  }

  try {
    let imageData = image;
    if (imageData) {
      const uploadStart = Date.now();
      const { uri, name, type } = imageData;
      const fileUrl = await upLoadFile(uri, name);
      console.log("⏱️ Upload time:", Date.now() - uploadStart, "ms");
      imageData = { uri: fileUrl, name, type };
    }
    const createStart = Date.now();
    const createData = {
      personalInformation: {
        ...values,
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
    console.log("⏱️ DB Create time:", Date.now() - createStart, "ms");

    console.log("🔥 Total API Time:", Date.now() - start, "ms");
    res.json({
      success: true,
      data: { _id: cv._id, personalInformation: cv.personalInformation },
    });
  } catch (error: any) {
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

    if (userId && !mongoose.Types.ObjectId.isValid(userId)) {
      return res.json({ success: false, message: "Invalid user ID format" });
    }
    if (!userId && !mongoose.Types.ObjectId.isValid(cvId)) {
      return res.json({ success: false, message: "Invalid CV ID format" });
    }

    const filter = userId
      ? { userId: new mongoose.Types.ObjectId(userId) }
      : { _id: new mongoose.Types.ObjectId(cvId) };

    const cv = await CVModel.findOneAndUpdate(
      filter,
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

  if (!mongoose.Types.ObjectId.isValid(cvId)) {
    return res.json({ success: false, message: "Invalid CV ID format" });
  }

  try {
    const cv = await CVModel.findById(new mongoose.Types.ObjectId(cvId));
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
