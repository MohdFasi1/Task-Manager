import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true }
});

export default mongoose.models.Appointment || mongoose.model("Appointment", AppointmentSchema);
