import { NextFunction, Request, Response } from "express";
import User from "../models/user.js";
import { hash, compare } from "bcrypt";
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constant.js";

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //get all users
    const users = await User.find();
    return res.status(200).json({ messgae: "OK", users });
  } catch (error) {
    return res.status(500).json({ messgae: "ERROR", reason: error.message });
  }
};

export const userSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //user signup
    const { name, email, password } = req.body;
    const exisitingUser = await User.findOne({ email });
    if (exisitingUser) return res.status(401).send("User data already exists");
    const hashedPassword = await hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    //create token and stored cookies

    res.clearCookie(COOKIE_NAME, {
      path: "/",
      domain: "localhost",
      httpOnly: true,
      signed: true,
    });

    const token = createToken(user._id.toString(), user.email, "7d");
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    res.cookie(COOKIE_NAME, token, {
      path: "/",
      domain: "localhost",
      expires,
      httpOnly: true,
      signed: true,
    });
    return res.status(201).json({ messgae: "OK", id: user._id.toString() });
  } catch (error) {
    return res.status(500).json({ messgae: "ERROR", reason: error.message });
  }
};

export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //user login
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send("User has not been registered");
    }
    const isCorrectPassword = await compare(password, user.password);
    if (!isCorrectPassword) {
      return res.status(403).send("Incorrect Password");
    }

    //create token and stored cookies

    res.clearCookie(COOKIE_NAME, {
      path: "/",
      domain: "localhost",
      httpOnly: true,
      signed: true,
    });

    const token = createToken(user._id.toString(), user.email, "7d");
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    res.cookie(COOKIE_NAME, token, {
      path: "/",
      domain: "localhost",
      expires,
      httpOnly: true,
      signed: true,
    });

    return res.status(200).json({ messgae: "OK", id: user._id.toString() });
  } catch (error) {
    return res.status(500).json({ messgae: "ERROR", reason: error.message });
  }
};
