const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// MongoDB Atlas connection
const dbURI = process.env.MONGO_URI; // Use environment variable for MongoDB URI

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
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
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Serve the task view page (task_view.html)
app.get('/task_view', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'task_view.html'));
  });
  

// Fetch all tasks from the database
app.get('/api/tasks', async (req, res) => {
    try {
      const tasks = await Task.find();  // Assuming Task is your Mongoose model
      res.json(tasks);  // Send the tasks as JSON
    } catch (err) {
      console.error('Error fetching tasks:', err);  // Log error for debugging
      res.status(500).json({ message: 'Error fetching tasks' });  // Return error as JSON
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
const port = process.env.PORT || 8080; // Railway uses 8080 by default
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
