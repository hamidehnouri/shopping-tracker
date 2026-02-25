import dotenv from "dotenv";
import app from "./app";
import initDatabase from "./config/init.js";

dotenv.config();

const port = Number(process.env.PORT ?? 3000);

async function startServer() {
  try {
    await initDatabase();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (e) {
    console.error("Failed to start server:", e);
    process.exit(1);
  }
}

startServer();
