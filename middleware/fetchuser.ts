import { NextFunction, Request, Response } from "express";

let jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

export const fetchuser = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  // Get the user from the jwt token and add id to req object
  const token = req.header("auth-token");

  //if token is not valid
  if (!token) {
    res.status(401).send({ error: "Please authenticate using a valid token" });
    return;
  }

  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
    return;
  } catch (error) {
    res.status(401).send({ error: "Please authenticate using a valid token" });
  }
};
