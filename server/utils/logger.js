const { createLogger, format, transports } = require("winston")

const logger = createLogger({
  level: process.env.NODE_ENV === "production" ? "error" : "debug",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: "teachnew-service" },
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      ),
    }),
  ],
})

module.exports = logger
