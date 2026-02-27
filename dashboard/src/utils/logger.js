/**
 * Logger utility for Decisify Dashboard
 * Provides environment-aware logging with different levels
 */

const isDevelopment = import.meta.env.DEV;

const LogLevel = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
};

class Logger {
  constructor(context = 'App') {
    this.context = context;
  }

  _log(level, ...args) {
    if (!isDevelopment && level === LogLevel.DEBUG) {
      return; // Skip debug logs in production
    }

    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${this.context}]`;

    switch (level) {
      case LogLevel.ERROR:
        console.error(prefix, ...args);
        break;
      case LogLevel.WARN:
        console.warn(prefix, ...args);
        break;
      case LogLevel.INFO:
        if (isDevelopment) {
          console.info(prefix, ...args);
        }
        break;
      case LogLevel.DEBUG:
        console.log(prefix, ...args);
        break;
      default:
        console.log(prefix, ...args);
    }
  }

  error(...args) {
    this._log(LogLevel.ERROR, ...args);
  }

  warn(...args) {
    this._log(LogLevel.WARN, ...args);
  }

  info(...args) {
    this._log(LogLevel.INFO, ...args);
  }

  debug(...args) {
    this._log(LogLevel.DEBUG, ...args);
  }
}

// Create default logger instance
export const logger = new Logger('Decisify');

// Factory function to create context-specific loggers
export const createLogger = (context) => new Logger(context);
