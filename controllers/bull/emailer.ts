const nodemailer = require("nodemailer");

export const sendEmailToNotify = async ({
  email,
  ogprice,
  price,
}: {
  email: string | undefined;
  ogprice : number,
  price: number;
}) => {
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
    to: email, //receivers
    subject: "Karma Realty price notification", //Subject line
    // text: `  /n`,
    html: `content ${price}`,
  });

  transporter.sendMail(message, ({ error, info }: any) => {
    if (error) {
      return console.log(error);
    }
    console.log("message sent : %s", info.messageId);
    console.log("Preview URL : %s", nodemailer.getTestMessageUrl(info));
  });
};
