import bcrypt from "bcryptjs";
import UserModel from "../models/User";
let jwt = require("jsonwebtoken");
import dotenv from "dotenv";
dotenv.config();
import { Request, Response } from "express";
import PuuModel from "../models/priceupdateusers";
const nodemailer = require("nodemailer");
const _ = require("lodash");
const JWT_SECRET = process.env.JWT_SECRET;

//create a new user
export const userSignup = async (req: Request, res: Response) => {
  try {
    const { name, email, password }: any = req.body;

    let user = await UserModel.findOne({ email: email });

    if (user) {
      return res.json({
        error: "A user with this email already exists.Please try logging in.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(password, salt);

    user = await UserModel.create({
      name: name,
      email: email,
      password: secPass,
    });

    const data = {
      user: {
        id: user.id,
      },
    };

    const authtoken = jwt.sign(data, JWT_SECRET);

    res.json({ authtoken });
  } catch (error: any) {
    console.log("Error in meeting : ", error.toString());
    res
      .sendStatus(500)
      .json({ error: "Something went wrong, please try again later" });
    return;
  }
};

// Authencticate using authtoken / login
export const userLogin = async (req: any, res: Response) => {
  try {
    const { email, password }: any = req.body;

    let user: any = await UserModel.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ error: "Please try to login with correct credentials" });
    }

    //creating password using bcryptjs
    const passwordCompare = await bcrypt.compare(password, user.password);

    //if not password then throw error
    if (!passwordCompare) {
      return res
        .status(400)
        .json({ error: "Please try to login with correct credentials" });
    }

    //creating a data to convert it in auth token
    const data = {
      user: {
        id: user.id,
      },
    };

    //create a new auth token
    const authtoken = jwt.sign(data, JWT_SECRET);

    let success = true;

    res.json({ success, authtoken });
  } catch (error: any) {
    console.log("Error in meeting : ", error.toString());
    res
      .status(500)
      .json({ error: "Something went wrong, please try again later" });
    return;
  }
};

// To loggin using auth token
export const getUser = async (req: any, res: Response) => {
  try {
    let userId = req.user.id;

    const user = await UserModel.findById(userId).select("-password");

    let name = user?.name;

    let email = user?.email;

    res.send({ name: name, email: email });
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

//if user forgot password check it exist and then pass token
export const forgotPassword = async (req: any, res: Response) => {
  const { email } = req.body;

  let user: any = await UserModel.findOne({ email: email });

  if (!user) {
    return res.status(400).json({
      error: "There is no account registered to this email. Please sign up.",
    });
  }

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30m",
  });

  //mail part start here
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.NODEMAILER_USER, // generated ethereal user
      pass: process.env.NODEMAILER_PASSWORD, // generated ethereal password
    },
  });

  let message = transporter.sendMail({
    from: `"Karma Realty" <${process.env.NODEMAILER_USER}>`, //sender address
    to: email, //receivers
    subject: "Account Activation Link", //Subject line
    // text: `  /n`,
    html: `<p> Please click on given link to reset your password.</p>
             <a href="https://whale-app-j72fn.ondigitalocean.app/reset-password?t=${token}">Click here to change password.</a>
             <P>Link will be expired in 30 minutes </p>
      `,
  });

  transporter.sendMail(message, ({ error, info }: any) => {
    if (error) {
      return res.json(error);
    }
  });
  return res.json({
    message: "Email has been sent , Kindly Follow the Instructions",
  });
};

//Route to reset the password.
export const resetPassword = async (req: any, res: Response) => {
  const { resetLink, newPass } = req.body;
  const salt = await bcrypt.genSalt(10);
  const secPass = await bcrypt.hash(newPass, salt);

  if (resetLink) {
    jwt.verify(
      resetLink,
      process.env.JWT_SECRET,
      function (error: any, dedcodedData: any) {
        // console.log(dedcodedData._id);

        if (error) {
          return res.status(401).json({
            error: "Incorrect Token or Token Expired",
          });
        }

        // UserModel.findOne({ resetLink }, async (err: any, user: any) => {
        //   if (err || !user) {
        //     return res
        //       .status(400)
        //       .json({ error: "User with this token not exist" });
        //   }

        //   const salt = await bcrypt.genSalt(10);
        //   const secPass = await bcrypt.hash(newPass, salt);

        //   const obj = {
        //     password: secPass,
        //   };

        //   user = _.extend(user, obj);

        //   user.save((error: any, result: any) => {
        //     if (error) {
        //       return res.status(400).json({ error: "reset password error" });
        //     } else {
        //       return res
        //         .status(200)
        //         .json({ error: "your password has been changed" });
        //     }
        //   });
        // });

        UserModel.findByIdAndUpdate(
          dedcodedData._id,
          { password: secPass },
          function (err, docs) {
            if (err) {
              console.log(err);
            } else {
              // console.log("password changed successfully",docs);
              return res
                .status(200)
                .json({ success: "your password has been changed" });
            }
          }
        );
      }
    );
  } else {
    return res.status(401).json({ error: "Authorization Error!!!" });
  }
};

//Adding house inside userdatabase
export const addHouse = async (req: any, res: Response) => {
  try {
    const { houseid } = req.body;

    let userId = req.user.id;
    let isUser = await UserModel.findById(userId);

    if (!isUser) {
      return res.status(404).send(" user Not Found");
    }

    let updated = await UserModel.updateOne(
      { _id: userId },
      { $push: { likehouse: houseid } }
    );

    let data = await UserModel.find({ _id: userId });

    return res.json(data[0].likehouse);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

//Removing house from the user database....
export const removeHouse = async (req: any, res: Response) => {
  try {
    const { houseid }: any = req.body;

    let userId = req.user.id;

    let isUser = await UserModel.findById(userId);

    if (!isUser) {
      return res.status(404).send(" user Not Found");
    }

    let removed = await UserModel.updateOne(
      { _id: userId },
      { $pull: { likehouse: houseid } }
    );

    let data = await UserModel.find({ _id: userId });

    res.json(data[0].likehouse);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

//Getting like-house from the database......
export const getlikedhouses = async (req: any, res: Response) => {
  try {
    let userId = req.user.id;

    let isUser = await UserModel.findById(userId);

    if (!isUser) {
      return res.status(404).send("user Not Found");
    }

    let data = await UserModel.find({ _id: userId })
      .populate("likehouse")
      .exec();
    //
    res.json(data[0].likehouse);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

export const addusertoupdate = async (req: any, res: Response) => {
  try {
    const { houseid, email } = req.body;

    let finduser = await PuuModel.findOne({ email: email });

    let user;

    let updated;

    let status;

    let houseids = finduser?.houseids;

    if (finduser) {
      let a = houseids?.includes(houseid);
      if (a) {
        status = true;
      } else {
        updated = await PuuModel.updateOne(
          { _id: finduser._id },
          { $push: { houseids: houseid } }
        );
      }
    } else {
      user = await PuuModel.create({
        email: email,
      });
      updated = await PuuModel.updateOne(
        { _id: user._id },
        { $push: { houseids: houseid } }
      );
    }
    if (status) {
      res.send({
        msg: "You have already requested an update for this property",
        stat: true,
      });
    } else {
      res.send({
        msg: "You will recieve an update for this property",
        stat: false,
      });
    }
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};
