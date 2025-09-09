import cron from 'node-cron';
import { connectDB } from '@/lib/db';
import Appointment from '@/models/Appointment';

async function cleanupPastAppointments() {
  await connectDB();
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  await Appointment.deleteMany({ date: { $lt: todayStr } });
  console.log('Deleted past appointments at', new Date().toISOString());
}

cron.schedule('0 0 * * *', cleanupPastAppointments);

// If you want to run immediately for testing:
// cleanupPastAppointments();
