import express, { Request, Response, NextFunction } from "express";
import { userAuth } from "../../models/auth";
import * as argon2 from "argon2";
import { sendEmail } from "../../middlewares/email";
import { handleErrors } from "../../middlewares/errorHandler";
import { generateOTP } from "../../middlewares/generateOTP";

export const signUp = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const pass = await argon2.hash(password);
    const user: any = new userAuth({
      firstName,
      lastName,
      email,
      password: pass,
    });
    await user.save();
    console.log(user);
    res.json({ message: "success", success: true, data: user });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ message: errors });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user: any = await userAuth.find({ email });
    if (!user) res.json({ message: "Account is not registered" });
    const verifyPassword = await argon2.verify(user?.password, password);
    if (!verifyPassword) res.json({ message: "Password does not match" });
    res.json({
      message: "success",
      success: true,
      data: {
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
      },
    });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ message: errors });
  }
};

export const forgetPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user: any = await userAuth.find(email);
    if (!user) res.json({ message: "Account is not registered" });
    const { otp, otpDate } = generateOTP();
    user.manageOTP.otp = otp;
    user.manageOTP.otpDate = otpDate;
    await user.save();

    const message = `<div>Dear ${user?.lastName}</div> <br /> <div>Your verification code is ${otp}</div><br /> <div>Verification code will expire within 1hr</div>`;
    sendEmail(user.email, "Requesting Password Reset", JSON.stringify(message));

    res.json({
      success: true,
      message: `Check your mail for your verification code`,
    });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ message: errors });
  }
};
export const verifyOTP = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  try {
    const user: any = await userAuth.find(email);
    if (!user) res.json({ message: "Account is not registered" });

    const { otp: userOtp, otpDate } = user.manageOTP;
    if (userOtp !== otp)
      res.json({ success: false, message: "Invalid Verification code!" });
    user.manageOTP = {};
    await user.save();

    res.json({ success: true, message: "Verification successfull" });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ message: errors });
  }
};
export const verifyPassword = async (req: Request, res: Response) => {
  const { email, newPassword } = req.body;

  try {
    const user: any = await userAuth.find(email);
    const verifyPassword = await argon2.verify(user?.password, newPassword);
    if (verifyPassword) res.json({ message: "You entered your old password" });
    const newPass = await argon2.hash(newPassword);
    user.password = newPass;
    await user.save();

    res.json({ success: true, message: "Password successfully reset" });
  } catch (error) {
    const errors = handleErrors(error);
    res.json({ message: errors });
  }
};
