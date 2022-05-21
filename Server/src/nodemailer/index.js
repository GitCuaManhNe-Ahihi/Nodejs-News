"use strict";
const nodemailer = require("nodemailer");
const {google} = require("googleapis");

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFESH_TOKEN = process.env.REFESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({refresh_token: REFESH_TOKEN});
export const sendMail = async (content, mail) => {
  const accessToken = await oAuth2Client.getAccessToken();
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: "shuriken8668@gmail.com",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFESH_TOKEN,
        accessToken: accessToken,
    }
  });
  let info = await transporter.sendMail({
    from: '"Manhneahihi 👻"shuriken8668@gmail.com', // sender address
    to: `${mail}`, // list of receivers
    subject: "Register Success ✔", // Subject line
    text: "your password?", // plain text body
    html: `
    Thank you for registering!
    <b>Your Account: ${mail}</b>
    <br>
    <b>Your Password: ${content}</b>`, // html body
  });
 
};
export const sendMailForgetPassword = async (content, mail) => {
    const accessToken = await oAuth2Client.getAccessToken();
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
          type: "OAuth2",
          user: "shuriken8668@gmail.com",
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          refreshToken: REFESH_TOKEN,
          accessToken: accessToken,
      }
    });
    let info = await transporter.sendMail({
      from: '"Manhneahihi 👻"shuriken8668@gmail.com', // sender address
      to: `${mail}`, // list of receivers
      subject: "Register Success ✔", // Subject line
      text: "your password?", // plain text body
      html: `
      <h1> This is new Password of your account, please change your passwordand don't forget it! =))) </h1
      <b>Your Account: ${mail}</b>
      <br>
      <b>Your Password: ${content}</b>`, // html body
    });
   
  };
  