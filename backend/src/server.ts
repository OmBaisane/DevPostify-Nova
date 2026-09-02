import app from "./app";
import { env } from "./config/env";
import { connectDatabase, disconnectDatabase } from "./config/database";

const startServer = async () => {
  try {
    await connectDatabase();

    const server = app.listen(env.PORT, () => {
      console.log(
        `🚀 DevPostify Nova API running on http://localhost:${env.PORT}`,
      );
    });

    const shutdown = async (signal: string) => {
      console.log(`\n${signal} received. Shutting down gracefully...`);

      server.close(async () => {
        await disconnectDatabase();
        console.log("HTTP server closed.");
        process.exit(0);
      });
    };

    process.on("SIGINT", () => {
      void shutdown("SIGINT");
    });

    process.on("SIGTERM", () => {
      void shutdown("SIGTERM");
    });
  } catch (error) {
    console.error("❌ Server startup failed:", error);
    process.exit(1);
  }
};

void startServer();
