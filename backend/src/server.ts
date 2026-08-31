import app from "./app";
import { env } from "./config/env";

const server = app.listen(env.PORT, () => {
  console.log(`DevPostify Nova API running on http://localhost:${env.PORT}`);
});

const shutdown = (signal: string) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);

  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
