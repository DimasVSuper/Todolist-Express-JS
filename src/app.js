import express from "express";
import cors from "cors";
import helmet from "helmet";
import todosRouter from "./routes/todos.js";
import { apiRateLimiter } from "./security/rateLimiter.js";
import { requestLogger } from "./security/logger.js";

const app = express();

const defaultOrigins = ["http://localhost:3000"];
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((o) => o.trim()).filter(Boolean)
  : defaultOrigins;

app.use(helmet());
app.use(cors({ origin: allowedOrigins }));
app.use(requestLogger);
app.use(express.json());
app.use(apiRateLimiter);

app.get("/", (req, res) => {
  res.json({ message: "TodoList API is running" });
});

app.use("/todos", todosRouter);

export default app;
