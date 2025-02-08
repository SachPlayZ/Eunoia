import mongoose from "mongoose";

// Type for our cached connection to track connection state
interface DatabaseConnection {
  isConnected?: boolean;
}

// Create a singleton connection object to maintain connection state across calls
const connection: DatabaseConnection = {};

async function connectToDatabase() {
  // Return early if we already have an active connection
  if (connection.isConnected) {
    return;
  }

  // Ensure the MongoDB URI is defined in environment variables
  if (!process.env.MONGODB_URI) {
    throw new Error("Please define MONGODB_URI environment variable");
  }

  try {
    // Attempt to connect to MongoDB with basic configuration
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
    });

    // Update connection state based on the readyState of the first connection
    connection.isConnected = db.connections[0].readyState === 1;

    console.log("Successfully connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}

// Set up event listeners to monitor connection status
mongoose.connection.on("error", (error) => {
  console.error("MongoDB connection error:", error);
  connection.isConnected = false;
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
  connection.isConnected = false;
});

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected");
  connection.isConnected = true;
});

export default connectToDatabase;