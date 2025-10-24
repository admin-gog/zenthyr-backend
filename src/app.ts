import express, { type NextFunction, type Request, type Response } from "express";
import userRoutes from "./routes/user.routes.js"
import "dotenv/config";
import mongoose from "mongoose";
import { ApiError } from "./utils/ApiError.js";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
const app = express();

app.use(express.json());

const uri = process.env.MONGO_URI;
if (!uri) {
  throw new Error("MONGO_URI is not defined in env");
}

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Zenthyr API's",
      version: "1.0.0",
      description: "API documentation for Zenthyr backend",
    },
  },
  apis: ["./dist/routes/*.js"], // <-- path to files containing Swagger comments
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/v1",userRoutes)

app.use((err: any, req: Request, res: Response, next: NextFunction

) => {

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
