import express, { Request, Response } from "express";
import CVModel from "../../models/cv";
import { handleErrors } from "../../middlewares/errorHandler";
import { upLoadFile } from "../../middlewares/file";

export const createCV = async (req: Request, res: Response) => {
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
  let { uri, name, type } = image;
  try {
    const file = await upLoadFile(uri, name);
    const cv: any = await CVModel.create({
      personalInformation: {
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
        image: { uri: file, name, type },
      },
      userId: _id,
      academic,
      certificate,
      image,
      experience,
      skill,
    });
    res.json({ success: true, data: cv });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ success: false, errors });
  }
};

export const updateCV = async (req: Request, res: Response) => {
  const { id }: any = req.params;
  const {
    personalInformation,
    academic,
    certificate,
    // image,
    experience,
    skill,
  } = req.body;
  try {
    // const file = await upLoadFile(uri, name);
    const cv = await CVModel.findOneAndUpdate(
      { userId: id },
      {
        $set: {
          personalInformation,
          academic,
          certificate,
          // image: { file, type },
          experience,
          skill,
        },
      },
      { new: true }
    );
    if (id !== cv?.userId.toString())
      res.json({ success: false, message: "CV not found" });
    console.log(cv);
    res.json({ success: true, data: cv });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ success: false, errors });
  }
};

export const getUSerCV = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const cv: any = await CVModel.findOne({ userId: id });

    if (!cv) res.json({ success: false, message: "User CV not found" });

    res.json({ success: true, data: cv });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ success: false, errors });
  }
};
