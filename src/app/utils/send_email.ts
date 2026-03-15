import nodemailer from "nodemailer";
import config from "../config";

export const sendEmail = async (to: string, subject: string, html: string) => {
  // 1️⃣ Create transporter
  const transporter = nodemailer.createTransport({
    host: config.nodemailer.smtp_host,
    port: Number(config.nodemailer.smtp_port) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: config.nodemailer.smtp_user,
      pass: config.nodemailer.smtp_pass,
    },
  });

  // 2️⃣ Send the email
  const info = await transporter.sendMail({
    from: `"Your App" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });

  //   console.log("📧 Email sent:", info.messageId);
};
