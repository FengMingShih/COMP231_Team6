const { MongoClient } = require("mongodb");

// MongoDB connection string
const uri = "mongodb+srv://fengmingshih:12345@cluster0.7tcf6tr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Database and collection names
const dbName = "TaskManagementSystem";
const collectionName = "tasks";

async function setupDatabase() {
  const client = new MongoClient(uri);

  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB!");

    const db = client.db(dbName);

    // Create collection if not exists
    const collections = await db.listCollections({ name: collectionName }).toArray();
    if (collections.length === 0) {
      await db.createCollection(collectionName);
      console.log(`Collection '${collectionName}' created.`);
    } else {
      console.log(`Collection '${collectionName}' already exists.`);
    }

    // Create an index on the taskName field
    await db.collection(collectionName).createIndex({ taskName: 1 });
    console.log("Index created for 'taskName' field.");
    
  } catch (error) {
    console.error("Error setting up database:", error);
  } finally {
    await client.close();
    console.log("Connection closed.");
  }
}

setupDatabase();
