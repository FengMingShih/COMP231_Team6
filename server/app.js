const express = require('express');
const cors = require('cors');  // Import the cors package
const { MongoClient } = require('mongodb');
const app = express();
const port = 3000;

// Enable CORS for all domains (you can restrict it to specific domains if needed)
app.use(cors()); // This should be placed before your routes

const uri = "mongodb+srv://fengmingshih:12345@cluster0.7tcf6tr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // MongoDB connection string
const dbName = "TaskManagementSystem"; // Replace with your database name
const collectionName = "tasks"; // Replace with your collection name

// Middleware to serve static files (like HTML, CSS, JS)
app.use(express.static('public'));

// Route to fetch all tasks from MongoDB
app.get('/tasks', async (req, res) => {
    const client = new MongoClient(uri);
    
    try {
        // Connect to MongoDB
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Fetch all tasks
        const tasks = await collection.find({}).toArray();

        // Send tasks as JSON response
        res.json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).send("Internal Server Error");
    } finally {
        await client.close();
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
