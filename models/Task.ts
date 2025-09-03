import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  priority: { type: String, enum: ["low", "medium", "high"], required: true },
  deadline: { type: String },
  userId: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

export default mongoose.models.Task || mongoose.model("Task", TaskSchema);
