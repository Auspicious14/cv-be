import { Request, Response } from "express";
import CVModel from "../../../models/cv";
import { handleErrors } from "../../../middlewares/errorHandler";
import { upLoadFile } from "../../../middlewares/file";
import { AIService } from "../../../services/ai";

export const createGuestCV = async (req: Request, res: Response) => {
  const { personalInformation, academic, certificate, experience, skill } =
    req.body;
  const {
    image,
    firstName,
    lastName,
    email,
    description,
    address,
    profession,
    phoneNumber,
    state,
    city,
    country,
  } = personalInformation;

  try {
    const enhancedDescription = await AIService.enhanceContent({
      section: "personal",
      content: description || "",
    });

    const enhancedExperience = await Promise.all(
      experience.map(async (exp: any) => ({
        ...exp,
        description: await AIService.enhanceContent({
          section: "experience",
          content: exp.description || "",
        }),
      }))
    );

    const experienceText = experience
      .map((exp: any) => exp.description)
      .join("\n");
    const suggestedSkills = await AIService.suggestSkills(experienceText);

    const enhancedSkills = [
      ...skill,
      ...suggestedSkills.map((name) => ({ name, isAISuggested: true })),
    ];

    let imageData = image;
    if (image?.uri) {
      const { uri, name, type } = image;
      const fileUrl = await upLoadFile(uri, name);
      imageData = { uri: fileUrl, name, type };
    }

    const cv = await CVModel.create({
      personalInformation: {
        firstName,
        lastName,
        email,
        description: enhancedDescription,
        address,
        profession,
        phoneNumber,
        state,
        city,
        country,
        image: imageData,
      },
      academic,
      certificate,
      experience: enhancedExperience,
      skill: enhancedSkills,
      isGuestCV: true,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    res.json({
      success: true,
      data: cv,
      message:
        "CV created successfully. Note: Guest CVs expire after 24 hours.",
    });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ success: false, errors });
  }
};

export const getGuestCV = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const cv = await CVModel.findOne({
      _id: id,
      isGuestCV: true,
      expiresAt: { $gt: new Date() },
    });

    if (!cv) {
      return res.json({
        success: false,
        message: "CV not found or has expired",
      });
    }

    res.json({ success: true, data: cv });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ success: false, errors });
  }
};
