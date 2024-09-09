import mongoose from "mongoose";

const uri = process.env.MONGODB_URI
const ConnectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected...");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

export default ConnectDB;
