// logger.js - A colorful and feature-rich logging library for Node.js and browser environments

const COLORS = {
  RESET: "\x1b[0m",
  INFO: "\x1b[34m", // Blue
  DEBUG: "\x1b[36m", // Cyan
  WARNING: "\x1b[33m", // Yellow
  ERROR: "\x1b[31m", // Red
  CRITICAL: "\x1b[41m", // Background Red
};

export class Logger {
  constructor(name = "root") {
    this.name = name;
    this.monitorErrors();
  }

  getCallerInfo() {
    const stack = new Error().stack.split("\n");
    // Extract caller from the stack trace (3rd line is the caller)
    const callerLine = stack[3] || "unknown";
    const match = callerLine.match(/\((.*):(\d+):(\d+)\)/);
    if (match) {
      const [_, file, line, col] = match;
      return `${file}:${line}:${col}`;
    }
    return "unknown";
  }

  log(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const color = COLORS[level.toUpperCase()] || COLORS.INFO;
    const callerInfo = this.getCallerInfo();

    console.group(`[${timestamp}] [${this.name}] [${level.toUpperCase()}] [${callerInfo}]`);
    console.log(`${color}${message}${COLORS.RESET}`);
    
    // Log additional data if provided
    if (data !== null && data !== undefined) {
      if (typeof data === 'object') {
        console.table(data);
      } else {
        console.log(data);
      }
    }
    
    console.groupEnd();
  }

  info(message, data = null) {
    this.log("INFO", message, data);
  }

  debug(message, data = null) {
    this.log("DEBUG", message, data);
  }

  warning(message, data = null) {
    this.log("WARNING", message, data);
  }

  error(message, data = null) {
    this.log("ERROR", message, data);
  }

  critical(message, data = null) {
    this.log("CRITICAL", message, data);
  }

  success(message, data = null) {
    this.log("INFO", "✅ " + message, data);
  }

  monitorErrors() {
    if (typeof process !== "undefined" && process.on) {
      process.on("uncaughtException", (err) => {
        this.error(`Uncaught Exception: ${err.message}\n${err.stack}`);
      });

      process.on("unhandledRejection", (reason, promise) => {
        this.warning(`Unhandled Promise Rejection: ${reason}`);
      });
    }
  }

  static getLogger(name) {
    return new Logger(name);
  }
}

// Export for npm (CommonJS)
if (typeof module !== "undefined" && module.exports) {
  module.exports = Logger;
}

// Export for npm (ESM)
export default Logger;

// Usage Example
if (typeof require !== "undefined" && require.main === module) {
  const logger = Logger.getLogger("MyApp");

  logger.info("Application started");
  logger.debug("Debugging mode active");
  logger.warning("Low disk space");
  logger.error("Failed to connect to DB");
  logger.critical("System shutdown imminent");

  // Trigger some errors for testing
  if (typeof Promise !== "undefined") {
    Promise.reject("Test unhandled rejection");
  }
  if (typeof setTimeout !== "undefined") {
    setTimeout(() => {
      throw new Error("Test uncaught exception");
    }, 1000);
  }
}
