import { User } from "../model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerController = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password: await bcrypt.hash(password, 10),
  });

  res.status(200).json({
    message: "User registerd successfully!",
    user,
    refreshToken,
  });
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;

  const userExist = await User.findOne({ email });
  if (!userExist) {
    return res.json({
      message: "User is not found!",
    });
  }

  const isPassword = await bcrypt.compare(password, userExist.password);

  if (!isPassword) {
    return res.json({
      message: "Password is wrong",
    });
  }

  let refreshToken = jwt.sign({ id: userExist._id }, process.env.JWTSECRET);
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });

  res.status(200).json({
    message: "User login succesfully",
    userExist,
  });
};

export const logoutController = (req, res) => {
  if (!req.cookies.refreshToken) {
    return res.json({
      message: "User is not logged in",
    });
  }
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });
  res.status(200).json({
    message: "User logout successfully",
  });
};
