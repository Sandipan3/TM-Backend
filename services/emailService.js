import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendReminderEmail = async (userEmail, task) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: userEmail,
    subject: `Reminder: ${task.title}`,
    text: `Task: ${task.title}\nDeadline: ${task.deadline}\nDon't forget to complete your task!`,
  };

  await transporter.sendMail(mailOptions);
};
