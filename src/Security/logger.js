import fs from "fs";
import path from "path";
import morgan from "morgan";

const logDir = path.resolve(process.cwd(), "Log");
const logFile = path.join(logDir, "Log.json");

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const stream = fs.createWriteStream(logFile, { flags: "a" });

// JSON line format for easier parsing / analysis
const jsonFormat = (tokens, req, res) => {
  const base = {
    time: new Date().toISOString(),
    remoteAddr: tokens["remote-addr"](req, res),
    method: tokens.method(req, res),
    url: tokens.url(req, res),
    status: Number(tokens.status(req, res)),
    responseTime: Number(tokens["response-time"](req, res)),
    length: tokens["res"](req, res, "content-length"),
  };

  return JSON.stringify(base);
};

export const requestLogger = morgan(jsonFormat, { stream });
