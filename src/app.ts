import express, { type NextFunction, type Request, type Response } from "express";
import userRoutes from "./routes/user.routes.js"
import gameRoutes from "./routes/game.routes.js"
import "dotenv/config";
import mongoose from "mongoose";
import { ApiError } from "./utils/ApiError.js";
const app = express();

app.use(express.json());

const uri = process.env.MONGO_URI;
if (!uri) {
  throw new Error("MONGO_URI is not defined in env");
}

app.use("/api/v1",userRoutes);
app.use("/api/v1",gameRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction

) => {
  console.error(JSON.stringify({
    resquest:{
      method: req.method,
      url: req.originalUrl,
      params: req.params,
      query: req.query,
      body: req.body,
    },
    statusCode: err.statusCode || 500,
  },null,2),{error:err});

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      statusCode:err.statusCode,
      message: err.message,
      errors: err.errors,
    });
  }

  // fallback for unknown errors
  return res.status(500).json({
    statusCode: err.statusCode,
    message: err.message || "Internal Server Error",
  });
});

mongoose
  .connect(uri)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.error("MongoDB Error:", err));
