import { Request, Response } from "express";
import CVModel from "../../../models/cv";
import { handleErrors } from "../../../middlewares/errorHandler";
import { upLoadFile } from "../../../middlewares/file";
import { AIService, AIEnhancementRequest } from "../../../services/ai";

export const createEnhancedCV = async (req: Request, res: Response) => {
  const { personalInformation, academic, certificate, experience, skill } =
    req.body;
  const {
    _id,
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
    // Enhance personal description
    const enhancedDescription = await AIService.enhanceContent({
      section: "personal",
      content: description,
    });

    // Enhance experience descriptions
    const enhancedExperience = await Promise.all(
      experience.map(async (exp: any) => ({
        ...exp,
        description: await AIService.enhanceContent({
          section: "experience",
          content: exp.description,
        }),
      }))
    );

    // Get AI-suggested skills based on experience
    const experienceText = experience
      .map((exp: any) => exp.description)
      .join("\n");
    const suggestedSkills = await AIService.suggestSkills(experienceText);

    // Combine user-provided and AI-suggested skills
    const enhancedSkills = [
      ...skill,
      ...suggestedSkills.map((name) => ({ name })),
    ];

    // Handle image upload
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
      userId: _id,
      academic,
      certificate,
      experience: enhancedExperience,
      skill: enhancedSkills,
    });

    res.json({ success: true, data: cv });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ success: false, errors });
  }
};

export const updateEnhancedCV = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { personalInformation, academic, certificate, experience, skill } =
    req.body;

  try {
    const enhancedDescription = await AIService.enhanceContent({
      section: "personal",
      content: personalInformation.description,
    });

    const enhancedExperience = await Promise.all(
      experience.map(async (exp: any) => ({
        ...exp,
        description: await AIService.enhanceContent({
          section: "experience",
          content: exp.description,
        }),
      }))
    );

    const experienceText = experience
      .map((exp: any) => exp.description)
      .join("\n");
    const suggestedSkills = await AIService.suggestSkills(experienceText);

    const enhancedSkills = [
      ...skill,
      ...suggestedSkills.map((name) => ({ name })),
    ];

    const cv = await CVModel.findOneAndUpdate(
      { userId: id },
      {
        $set: {
          personalInformation: {
            ...personalInformation,
            description: enhancedDescription,
          },
          academic,
          certificate,
          experience: enhancedExperience,
          skill: enhancedSkills,
        },
      },
      { new: true }
    );

    if (!cv || id !== cv.userId.toString()) {
      return res.json({ success: false, message: "CV not found" });
    }

    res.json({ success: true, data: cv });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ success: false, errors });
  }
};
