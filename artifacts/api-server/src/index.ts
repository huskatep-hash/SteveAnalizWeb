import { gunlukBlogYaz } from "./scheduler";
import { gunlukHaberleriCek } from "./news-scheduler";
import cron from "node-cron";
import app from "./app";
import { logger } from "./lib/logger";

const rawPort = process.env["PORT"];
if (!rawPort) {
  throw new Error("PORT environment variable is required but was not provided.");
}
const port = Number(rawPort);
if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }
  logger.info({ port }, "Server listening");
});

cron.schedule("0 6 * * *", gunlukBlogYaz, { timezone: "Europe/Istanbul" });
cron.schedule("0 6 * * *", gunlukHaberleriCek, { timezone: "Europe/Istanbul" });
console.log("Scheduler aktif - her sabah 06:00 Istanbul saati");
