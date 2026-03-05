import express from "express";
import routes from "./routes";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://192.168.1.158:3000"],
  }),
);

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api", routes);

export default app;
