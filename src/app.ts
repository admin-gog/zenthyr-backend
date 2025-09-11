import express from "express";
import userRoutes from "./routes/user.routes.js"
import "dotenv/config";
import mongoose from "mongoose";
const app = express();

app.use(express.json());

const uri = process.env.MONGO_URI;
if (!uri) {
  throw new Error("MONGO_URI is not defined in env");
}

app.use("/api/auth",userRoutes)

mongoose
  .connect(uri)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.error("MongoDB Error:", err));
