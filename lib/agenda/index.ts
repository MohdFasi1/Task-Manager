// lib/agenda/index.ts
import { Agenda } from 'agenda';
import { defineGenerateScheduleJob } from './jobs/generate-schedule.job';

const mongoConnectionString = process.env.MONGODB_URI!;

export const agenda = new Agenda({
  db: {
    address: mongoConnectionString,
    collection: 'agendaJobs',
  },
});

defineGenerateScheduleJob(agenda);
