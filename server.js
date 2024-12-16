const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// MongoDB Atlas connection
const dbURI = 'mongodb+srv://fengmingshih:12345@cluster0.7tcf6tr.mongodb.net/TaskManagementSystem?retryWrites=true&w=majority';

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

// Define the User schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  //passwordHash: { type: String, required: true },
  passwordHash: { type: String },
  role: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

// Async function to fetch users
/*const fetchUsers = async () => {
  try {
    const users = await User.find({});  // Use await here
    console.log('Fetched users:', users);  // This will show all the users in the database
  } catch (err) {
    console.error('Error:', err);  // Handle any error that occurs
  } finally {
    mongoose.connection.close();  // Close the connection after querying
  }
};*/

// Call the function to fetch users
//fetchUsers();


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



// Serve the view users page (view_users.html)
app.get('/view_users', async (req, res) => {
  try {
    const users = await User.find(); // This will fetch all users
    res.sendFile(path.join(__dirname, 'views', 'view_users.html')); // Serve the view_users.html file
  } catch (err) {
    console.error('Error fetching users:', err);  // Log the error
    res.status(500).send('Error fetching users');  // Return an error if there's an issue
  }
});

// API to get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();  // Fetch all users from the users collection
    //console.log('Users fetched from database:', users);  // Log the users
    res.json(users);  // Send the users in JSON format
  } catch (err) {
    console.error('Error fetching users:', err);  // Log any error
    res.status(500).send('Error fetching users');
  }
});

// POST (Add) a new user
app.post('/api/users', async (req, res) => {
  const { username, email, role } = req.body;

  const newUser = new User({
    username,
    email,
    role,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  try {
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding user' });
  }
});

// API routes (Add the GET route to fetch user by ID)
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);  // Find the user by ID
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);  // Return the user data
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching user' });
  }
});

// PUT (Update) a user by ID
app.put('/api/users/:id', async (req, res) => {
  const { username, email, role } = req.body;

  try {
    // Update the user with the new data
    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
      username,
      email,
      role,
      updatedAt: new Date() // Update the updatedAt field
    }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);  // Return the updated user
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating user' });
  }
});

// DELETE a user by ID
app.delete('/api/users/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting user' });
  }
});





// Start the server
const port = process.env.PORT || 5500;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
