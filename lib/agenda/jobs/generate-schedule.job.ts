// lib/agenda/jobs/generate-schedule.job.ts
import { Agenda } from 'agenda';

export const defineGenerateScheduleJob = (agenda: Agenda) => {
  agenda.define("generate daily schedule", async (job) => {
  const { userId } = job.attrs.data as { userId: string };

  console.log(`Generating schedule for user: ${userId} at ${new Date()}`);

  // Dummy AI scheduling (we’ll upgrade this below)
  const schedule = [
    { time: "7:00 AM", task: "Wake up" },
    { time: "8:00 AM", task: "Exercise" },
    { time: "9:00 AM", task: "Start Work" },
  ];

  // TODO: Save this to MongoDB or send a notification
  console.log("Generated schedule:", schedule);
});


agenda.on("ready", async () => {
  // For now, let's just assume 1 fixed test user
  const testUserId = "test_user_1";

  await agenda.cancel({ name: "generate daily schedule" }); // avoid duplicates
  await agenda.every("0 7 * * *", "generate daily schedule", { userId: testUserId }); // cron: 7:00 AM daily
});
};