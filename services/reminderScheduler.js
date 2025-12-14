import cron from "node-cron";
import Task from "../models/Task.js";
import { sendReminderEmail } from "./emailService.js";

/**
 * Reminder Cron
 * Runs every minute
 */
cron.schedule("* * * * *", async () => {
  console.log("⏰ Reminder cron tick:", new Date().toISOString());

  try {
    const now = new Date();

    /**
     * Find tasks that:
     * - are not completed
     * - reminder time has passed
     * - reminder has NOT been sent yet
     */
    const tasksToRemind = await Task.find({
      completed: false,
      remindAt: { $lte: now },
      lastReminderSentAt: null,
    }).populate("userId", "email");

    console.log(`📨 Tasks eligible for reminder: ${tasksToRemind.length}`);

    for (const task of tasksToRemind) {
      if (!task.userId?.email) {
        console.warn(`⚠️ Task ${task._id} has no user email`);
        continue;
      }

      try {
        console.log(`✉️ Sending reminder to ${task.userId.email}`);

        await sendReminderEmail(task.userId.email, task);

        // Mark reminder as sent
        task.lastReminderSentAt = now;
        await task.save();

        console.log(`✅ Reminder sent for task: ${task.title}`);
      } catch (mailError) {
        console.error(
          `❌ Failed to send email for task ${task._id}`,
          mailError
        );
      }
    }
  } catch (error) {
    console.error("🔥 Reminder cron failed:", error);
  }
});

console.log("🚀 Reminder cron initialized (runs every minute)");
