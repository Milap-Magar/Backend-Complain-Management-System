const nodemailer = require("nodemailer");

const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

async function sendCredential(email, password) {
  try {
    const info = await transporter.sendMail({
      from: '"Milap Magar" <abdSchool@result.net>',
      to: email,
      subject: "Welcome to our app",
      text: `Thank you for registering with our app!\n\nYour email is :${email} and\n\nYour password is:${password} \n\n Please change your password on 1st login`,
    });

    console.log("message SEnd to " + email);
  } catch (error) {
    console.log("Error sending email:", error);
    throw error;
  }
}

module.exports = sendCredential;