import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    // MongoDB connection events
    mongoose.connection.on("connected", () => {
      console.log("MongoDB Connected");
    });

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB Error: ", err);
    });

    // Connect to MongoDB
    // Note: `useNewUrlParser` and `useUnifiedTopology` are deprecated for MongoDB Node driver v4+
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);

  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};
