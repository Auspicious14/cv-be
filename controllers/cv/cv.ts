import { Request, Response } from "express";
import CVModel from "../../models/cv";
import { handleErrors } from "../../middlewares/errorHandler";
import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import hbs from "handlebars";

hbs.registerHelper("dateFormat", (date: string, formatStr: string) =>
  format(new Date(date), formatStr)
);
import { format } from "date-fns";

export const getCV = async (req: Request, res: Response) => {
  const { cvId } = req.params;
  const userId = (req as any).user?._id;
  const id = userId || cvId;

  try {
    const cv = await CVModel.findOne({ _id: id }).select("-__v -_id -userId");
    if (!cv) return res.json({ success: false, message: "CV not found" });

    res.json({
      success: true,
      data: {
        personalInformation: cv.personalInformation,
        academic: cv.academic,
        certificate: cv.certificate,
        experience: cv.experience,
        skill: cv.skill,
        language: cv.language,
      },
    });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ success: false, errors });
  }
};

export const generatePDF = async (req: Request, res: Response) => {
  const { cvId, template } = req.body;

  try {
    const cv = await CVModel.findById(cvId);
    if (!cv)
      return res.status(404).json({ success: false, message: "CV not found" });

    const templatePath = path.join(
      __dirname,
      `../../src/templates/${template.toLowerCase()}.html`
    );

    if (!fs.existsSync(templatePath)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid template" });
    }

    const html = fs.readFileSync(templatePath, "utf-8");
    const templateRender = hbs.compile(html);
    const finalHTML = templateRender(cv.toObject());

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(finalHTML);
    const pdfBuffer = await page.pdf({ format: "A4" });
    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(
        cv.personalInformation?.firstName || "cv"
      )}.pdf"`
    );
    res.send(pdfBuffer);
  } catch (error) {
    const errors = handleErrors(error);
    res.status(500).json({ success: false, errors });
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
