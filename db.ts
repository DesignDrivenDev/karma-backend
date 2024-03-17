import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mongoURI = process.env.MONGO_URI ?? "";

// const options = {
//   serverSelectionTimeoutMS: 40000,
// };
// export const connectToMongo = () => {
//   mongoose.connect(mongoURI!, options, () => {
//     console.log("Connected to Mongo Successfully");
//   });
// };

export async function connectToMongo() {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected To Database!");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
