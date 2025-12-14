import { sendReminderEmail } from "./emailService.js";

await sendReminderEmail("sandipanjha3@gmail.com", {
  title: "Local Test Email",
  deadline: new Date(),
});

console.log("Local email test done");
