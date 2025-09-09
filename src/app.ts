import express from "express";
import type { Request,Response } from "express";
import {MongoClient} from "mongodb";
import userRoutes from "./routes/userRoutes.js"
import "dotenv/config";
const app = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

const uri = process.env.MONGO_URI;
if (!uri) {
  throw new Error("MONGO_URI is not defined in env");
}

const client = new MongoClient(uri);

app.use("api/user",userRoutes)

client
  .connect()
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.error("MongoDB Error:", err));
