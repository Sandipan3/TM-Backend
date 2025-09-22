import cron from "node-cron";
import Task from "../models/Task.js";
import { sendReminderEmail } from "./emailService.js"; // Assuming your email function is in this file

// Schedule the job to run every minute
cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60000);

    // Find tasks within the last minute that need a reminder
    const tasksToRemind = await Task.find({
      // 1. Find tasks scheduled within the last 60 seconds
      remindAt: { $gt: oneMinuteAgo, $lte: now },
      // 2. Only find incomplete tasks
      completed: false,
      // 3. Only find tasks where the current reminder time is different
      //    from the one we last sent an email for. This handles edits.
      $expr: { $ne: ["$remindAt", "$lastReminderSentAt"] },
    }).populate("userId", "email");

    for (const task of tasksToRemind) {
      // Ensure user and email are populated before trying to send
      if (task.userId && task.userId.email) {
        await sendReminderEmail(task.userId.email, task);
        console.log(
          `Reminder sent for task: "${task.title}" to ${task.userId.email}`
        );

        task.lastReminderSentAt = task.remindAt;
        await task.save();
      }
    }
  } catch (error) {
    console.error("Error during reminder schedule:", error);
  }
});

console.log("Reminder scheduler started successfully. Checking every minute.");
