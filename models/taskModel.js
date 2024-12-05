import mongoose from 'mongoose';

// Define the Task schema
const taskSchema = new mongoose.Schema({
  taskTitle: { type: String, required: true },
  assignedTo: { type: String, required: true },
  taskContent: { type: String, required: true },
  estimatedTime: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create the Task model
const Task = mongoose.model('Task', taskSchema);

export default Task;
