import cron from "node-cron";
import Task from "../models/Task.js";
import { sendReminderEmail } from "./emailService.js";

// Run every minute
cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60 * 1000); // last 60 sec window

    // Find pending tasks that need reminders
    const tasksToRemind = await Task.find({
      remindAt: { $gt: oneMinuteAgo, $lte: now }, // due now
      completed: false, // not finished
      $expr: { $ne: ["$remindAt", "$lastReminderSentAt"] }, // avoid duplicates
    }).populate("userId", "email");

    for (const task of tasksToRemind) {
      if (task.userId?.email) {
        await sendReminderEmail(task.userId.email, task); // send email

        task.lastReminderSentAt = task.remindAt; // mark as sent
        await task.save();
      }
    }
  } catch (error) {
    console.error("Reminder cron error:", error);
  }
});

console.log("Reminder cron running (every minute)");
