import express from "express";
import { loggingMiddleware, errorHandler } from "./middleware";

const app = express();
app.use(express.json());

// Use the middleware (example values)
app.use(loggingMiddleware("backend", "handler"));

app.get("/", (_req, res) => {
  res.json({ status: "ok" });
});

// Sample route that throws to demonstrate error logging
app.get("/fail", () => {
  throw new Error("simulated failure for testing logs");
});

// Register error handler at the end
app.use(errorHandler("backend", "handler"));

const port = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(port, () => console.log(`Server listening on ${port}`));
