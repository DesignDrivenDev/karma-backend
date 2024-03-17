import { Request, Response } from "express";
import ContactModel from "../models/contact";
const nodemailer = require("nodemailer");
import dotenv from "dotenv";
dotenv.config();

export const contactDetails = async (req: any, res: Response) => {
  try {
    const { name, inquiryType, phoneNo, inquiryDetails, value, email } =
      req.body;

    ContactModel.create({
      name: name,
      inquiryType: inquiryType,
      phoneNo: phoneNo,
      email: email,
      inquiryDetails: inquiryDetails,
      value: value,
    });

    res.status(200).send({ success: true });

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

    //email sent to client
    let message = await transporter.sendMail({
      from: `"Karma Realty" <${process.env.NODEMAILER_USER}>`, //sender address
      to: email, //receivers
      subject: "Karma Realty - Enquiry Submission", //Subject line
      html: `<p style="white-space: pre-line;">Hello ${name}!</p> Your inquiry for ${inquiryType === "buy" ? "buying a house" : "selling a house"
        } has been registered.<p> <p>An agent will be in touch at the earliest to help you  ${inquiryType === "buy"
          ? "buy a property best matched to your needs."
          : "close the best deal for your sale."
        }</p> Thank you for your interest.</p><p>Regards,</p><p>Karma Realty Group</p>`,
    });

    //email sent to mangesh 
    let message2 = await transporter.sendMail({
      from: `"Karma Realty" <${process.env.NODEMAILER_USER}>`, //sender address
      to: process.env.NODEMAILER_USER, //receivers
      subject: "Karma Realty - Enquiry Submission", //Subject line
      html: `<p style="white-space: pre-line;">Hello ${name}!</p> Your inquiry for ${inquiryType === "buy" ? "buying a house" : "selling a house"
        } has been registered.<p> <p>An agent will be in touch at the earliest to help you  ${inquiryType === "buy"
          ? "buy a property best matched to your needs."
          : "close the best deal for your sale."
        }</p> Thank you for your interest.</p><p>Regards,</p><p>Karma Realty Group</p>`,
    });

    transporter.sendMail(message , message2, ({ error, info }: any) => {
      if (error) {
        return console.log(error);
      }
      console.log("message sent : %s", info.messageId);
      console.log("Preview URL : %s", nodemailer.getTestMessageUrl(info));
    });
  } catch (error: any) {
    console.log("Error in contact : ", error.toString());
    res
      .sendStatus(500)
      .json({ error: "Something went wrong, please try again later" });
    return;
  }

  
};
