const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;

// MongoDB connection (hardcoded)
const mongoURI = 'mongodb+srv://fengmingshih:12345@cluster0.7tcf6tr.mongodb.net/TaskManagementSystem?retryWrites=true&w=majority';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Define Task schema and model
const taskSchema = new mongoose.Schema({
  taskTitle: String,
  assignedTo: String,
  taskContent: String,
  estimatedTime: Date
});

const Task = mongoose.model('Task', taskSchema);

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Parse incoming JSON data
app.use(express.json());

// Home route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// API endpoint to fetch tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).send('Error fetching tasks');
  }
});

// Serve task_view.html
app.get('/task_view', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.sendFile(path.join(__dirname, 'views', 'task_view.html'));
  } catch (err) {
    res.status(500).send('Error fetching tasks');
  }
});

// Create new task
app.post('/api/tasks', async (req, res) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).send('Error creating task');
  }
});

// Delete task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).send('Error deleting task');
  }
});

// Update task
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTask);
  } catch (err) {
    res.status(500).send('Error updating task');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
