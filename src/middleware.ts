import { Request, Response, NextFunction } from "express";
import { log } from "./logger";

export function loggingMiddleware(stack = "backend", packageName = "handler") {
  return (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    // Fire-and-forget: record incoming request
    void log(stack, "info", packageName, `Incoming ${req.method} ${req.originalUrl}`);

    // When response finishes, log status and duration
    res.on("finish", () => {
      const duration = Date.now() - start;
      void log(
        stack,
        "info",
        packageName,
        `Request ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`
      );
    });

    next();
  };
}

export function errorHandler(stack = "backend", packageName = "handler") {
  // Express error-handling middleware (four args)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (err: any, req: Request, res: Response, _next: NextFunction) => {
    const msg = `${err?.message || String(err)}`;
    void log(stack, "error", packageName, `Error in ${req.method} ${req.originalUrl}: ${msg}`);

    // Optionally include stack trace for server-side logs
    if (err?.stack) {
      void log(stack, "debug", packageName, `Stack: ${err.stack}`);
    }

    res.status(500).json({ error: "internal_server_error" });
  };
}

// Example usage:
// await log('auth-service','error','affordmed-logging-middleware','msg',{ token: 'YOUR_TOKEN_HERE' });
