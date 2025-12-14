import cron from "node-cron";
import Task from "../models/Task.js";
import { sendReminderEmail } from "./emailService.js";

/**
 * Reminder Cron
 * Runs every minute
 * Sends reminder ONCE when remindAt time is reached
 */
cron.schedule("* * * * *", async () => {
  console.log("⏰ Reminder cron tick:", new Date().toISOString());

  try {
    const now = new Date();

    const tasksToRemind = await Task.find({
      completed: false,
      remindAt: { $lte: now }, // reminder time reached
      lastReminderSentAt: null, // not sent yet
    }).populate("userId", "email");

    console.log(`Tasks eligible: ${tasksToRemind.length}`);

    for (const task of tasksToRemind) {
      if (!task.userId?.email) continue;

      console.log(`Sending reminder to ${task.userId.email}`);

      try {
        await sendReminderEmail(task.userId.email, task);

        // Mark as sent EXACTLY ONCE
        task.lastReminderSentAt = task.remindAt;
        await task.save();

        console.log(`Reminder sent for "${task.title}"`);
      } catch (err) {
        console.error(`Email failed for task ${task._id}`, err);
      }
    }
  } catch (error) {
    console.error("Reminder cron error:", error);
  }
});

console.log("Reminder cron initialized");
