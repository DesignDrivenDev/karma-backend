import { Request, Response } from "express";
import MeetingModel from "../models/meeting";
const nodemailer = require("nodemailer");
import dotenv from "dotenv";
import HouseModel from "../models/house";
dotenv.config();

//api for meeting details
export const meetingDetails = async (req: any, res: Response) => {
  try {
    const { name, phoneNo, Email, Date, Description, Meetingtype, id } =
      req.body;

    MeetingModel.create({
      name: name,
      phoneNo: phoneNo,
      Date: Date,
      Email: Email,
      Description: Description,
      Meetingtype: Meetingtype,
      id: id,
    });

    // console.log(id);

    let response: any = await HouseModel.findById(id);

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

    //Email sended to client
    let message = await transporter.sendMail({
      from: `"Karma Realty" <${process.env.NODEMAILER_USER}>`, //sender address
      to: Email, //receivers
      subject: "Karma Realty - Tour Request", //Subject line
      // text: `  /n`,
      html: `<p style="white-space: pre-line;">Hello ${name}!</p>Your house tour for the date ${Date} is confirmed. An agent will be in touch for further confirmation.<p> Thank you for your interest.</p><p>Regards,</p><p>Karma Realty Group</p>`,
    });

    //Email sended to us
    let message2 = await transporter.sendMail({
      from: `"Karma Realty" <${process.env.NODEMAILER_USER}>`, //sender address
      to: process.env.NODEMAILER_USER, //receivers
      subject: "Karma Realty - Tour Request Information", //Subject line
      html: `<p>Hello</p>
      <p>${name} has inquired for a house in ${
        response.subdivisionName
      } They have requested for a ${Meetingtype} meeting on ${Date}</p>
      <p>You may contact them on ${phoneNo} or ${Email}</p>
      <p>The agent details pertaining to the house are as follows:</p>
       ${response.listPrice ? `<p>Price: ${response.listPrice}</p>` : ""}
       ${
         response.sellingAgentFullName
           ? `<p>${response.sellingAgentFullName}</p>`
           : ""
       }
       ${
         response.listAgentDirectWorkPhone
           ? `<p>Listing Agent Phone # ${response.listAgentDirectWorkPhone} </p>`
           : ""
       }
       ${response.listAgentMUI ? `<p>Listing Agent MUI</p> ` : ""}
        ${
          response.listingAgentMLSBoard
            ? `<p>Listing Agent MLS Board: ${response.listingAgentMLSBoard}</p>`
            : ""
        }
        <p>Other public details related to the property may be accessed via the listing page here.</p>
        <a href="https://whale-app-j72fn.ondigitalocean.app/property/${id}">Click here to View propertie details</a>
        <p> Regards </p>
        <p> Karma Realty </p>`,
    });

    transporter.sendMail(message, message2, ({ error, info }: any) => {
      if (error) {
        return console.log(error);
      }
      console.log("message sent : %s", info.messageId);
      console.log("Preview URL : %s", nodemailer.getTestMessageUrl(info));
    });
  } catch (error: any) {
    console.log("Error in meeting : ", error.toString());
    res
      .sendStatus(500)
      .json({ error: "Something went wrong, please try again later" });
    return;
  }
};
