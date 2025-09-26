import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: "587",
  secure: false,
  auth: {
    user: "97e69c001@smtp-brevo.com", // Will use '97e69c001@smtp-brevo.com'
    pass: "MdEGkBPJN9qnLAOh", // Will use your Master Password
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
