// src/logger.js
const BACKEND_LOG_URL = "http://127.0.0.1:8000/api/logs";

export function initFrontendLogger() {
  const sendLog = async (level, message, stack = "") => {
    try {
      await fetch(BACKEND_LOG_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          level,
          message,
          url: window.location.href,
          stack,
        }),
      });
    } catch (e) {
      // Avoid recursive logging loops if backend is down or CORS rejects it
    }
  };

  // Override standard console logs
  const originalLog = console.log;
  const originalWarn = console.warn;
  const originalError = console.error;

  console.log = (...args) => {
    originalLog.apply(console, args);
    sendLog("info", args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
  };

  console.warn = (...args) => {
    originalWarn.apply(console, args);
    sendLog("warn", args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
  };

  console.error = (...args) => {
    originalError.apply(console, args);
    sendLog("error", args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
  };

  // Capture uncaught script errors
  window.onerror = (message, source, lineno, colno, error) => {
    const errorMsg = `${message} at ${source}:${lineno}:${colno}`;
    sendLog("error", errorMsg, error ? error.stack : "");
    return false; // let default browser handling run as well
  };

  // Capture unhandled promise rejections
  window.onunhandledrejection = (event) => {
    const errorMsg = `Unhandled Promise Rejection: ${event.reason}`;
    sendLog("error", errorMsg, event.reason && event.reason.stack ? event.reason.stack : "");
  };
}
