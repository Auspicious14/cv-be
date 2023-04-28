import express, { Request, Response, NextFunction } from "express";
import { userAuth } from "../../models/auth";
export const signUp = async (req: Request, res: Response) => {
  const { firstName, lastName, email, passowrd } = req.body;

  try {
    const user: any = new userAuth({ firstName, lastName, email, passowrd });
    await user.save();
    console.log(user);
    res.json({ message: "success", data: user });
  } catch (error) {
    res.json({ error });
  }
};
