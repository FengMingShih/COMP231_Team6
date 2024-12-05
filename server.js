const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// MongoDB Atlas connection string
const dbURI = 'mongodb+srv://fengmingshih:12345@cluster0.7tcf6tr.mongodb.net/TaskManagementSystem?retryWrites=true&w=majority';

// MongoDB connection
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB Atlas');
}).catch(err => {
  console.log('Error connecting to MongoDB:', err);
});

// Define the Task model
const taskSchema = new mongoose.Schema({
    taskTitle: String,
    assignedTo: String,
    taskContent: String,
    estimatedTime: Date,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
const Task = mongoose.model('Task', taskSchema);

// Middleware to parse request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the home page (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));  // Ensure it serves index.html
});

// Serve the task view page (task_view.html)
app.get('/task_view', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.sendFile(path.join(__dirname, 'views', 'task_view.html'));  // Ensure it serves task_view.html
  } catch (err) {
    res.status(500).send('Error fetching tasks');
  }
});

// API to get all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).send('Error fetching tasks');
  }
});

// API to get a task by ID
app.get('/api/tasks/:id', async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
      res.json(task);
    } catch (err) {
      res.status(500).send('Error fetching task');
    }
});

// API to create a task
app.post('/api/tasks', async (req, res) => {
  const { taskTitle, assignedTo, taskContent, estimatedTime } = req.body;
  try {
    const newTask = new Task({ taskTitle, assignedTo, taskContent, estimatedTime });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).send('Error creating task');
  }
});

// API to update a task
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTask);
  } catch (err) {
    res.status(500).send('Error updating task');
  }
});

// API to delete a task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).send('Error deleting task');
  }
});

// Start the server
const port = 5500; // Use a fixed port for both local and Railway
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
