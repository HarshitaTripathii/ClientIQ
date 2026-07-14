import cors from "cors";
import express from "express";
import clientRoutes from "./routes/clientRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
  "http://127.0.0.1:5173",
];

app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (request, response) => {
  response.json({ message: "ClientIQ Express API is running" });
});

app.use("/api/clients", clientRoutes);
app.use(errorHandler);

export default app;
