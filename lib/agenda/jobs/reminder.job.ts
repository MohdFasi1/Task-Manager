import {agenda} from "@/lib/agenda";

agenda.define("send reminder", async (job) => {
  const { task } = job.attrs.data as { task: string };
  console.log("🔔 Reminder:", task);
});
