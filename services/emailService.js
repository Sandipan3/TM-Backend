import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_KEY);

export const sendReminderEmail = async (userEmail, task) => {
  await resend.emails.send({
    from: process.env.FROM_EMAIL,
    to: userEmail,
    subject: `⏰ Reminder: ${task.title}`,
    html: `
      <div style="font-family: Arial, sans-serif">
        <h2>Task Reminder</h2>
        <p><strong>Task:</strong> ${task.title}</p>
        <p><strong>Deadline:</strong> ${new Date(
          task.deadline
        ).toLocaleString()}</p>
        <p>Don't forget to complete your task!</p>
      </div>
    `,
  });
};
