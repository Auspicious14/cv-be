import express, { Request, Response } from "express";
import CVModel from "../../models/cv";
import { handleErrors } from "../../middlewares/errorHandler";
import { upLoadFile } from "../../middlewares/file";

export const createCV = async (req: Request, res: Response) => {
  const {
    personalInformation,
    academic,
    certificate,
    experience,
    skill,
    image,
  } = req.body;
  // const {firstName, lastName, email, dateOfBirth} = personalInformation
  console.log(req.body);
  try {
    const cv: any = await CVModel.create({
      personalInformation,
      academic,
      certificate,
      experience,
      skill,
      image,
    });
    console.log(cv);
    res.json({ success: true, data: cv });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ success: false, errors });
  }
};

export const updateCV = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    personalInformation,
    academic,
    certificate,
    image,
    experience,
    skill,
  } = req.body;
  //   const { firstName, lastName, email, dateOfBirth } = personalInformation;
  //   const [{school, course, fromDate, toDate}] =academic
  const { uri, name, type } = image;

  try {
    const file = await upLoadFile(uri, name);
    const cv = await CVModel.findByIdAndUpdate(
      id,
      {
        $set: {
          personalInformation,
          academic,
          certificate,
          image: { file, type },
          experience,
          skill,
        },
      },
      { new: true }
    );
    if (id !== cv?.id) res.json({ success: false, message: "CV not found" });

    res.json({ success: true, data: cv });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ success: false, errors });
  }
};

export const getUSerCV = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const cv: any = await CVModel.findById(id);

    if (!cv) res.json({ success: false, message: "User CV not found" });

    res.json({ success: true, data: cv });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ success: false, errors });
  }
};
