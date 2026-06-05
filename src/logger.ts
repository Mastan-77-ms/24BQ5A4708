import axios from "axios";

export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

export interface LogPayload {
  stack: string;
  level: LogLevel;
  package: string;
  message: string;
}

const DEFAULT_URL = "http://4.224.186.213/evaluation-service/logs";

export async function log(
  stack: string,
  level: LogLevel,
  packageName: string,
  message: string,
  opts?: { url?: string; token?: string }
): Promise<boolean> {
  const url = opts?.url || process.env.LOG_SERVER_URL || DEFAULT_URL;
  const token = opts?.token || process.env.LOG_SERVER_TOKEN;

  const payload: LogPayload = {
    stack,
    level,
    package: packageName,
    message,
  };

  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    if (process.env.LOG_DEBUG === 'true') {
      try {
        console.debug(
          `[logger debug] url=${url} headers=${JSON.stringify(headers)} payload=${JSON.stringify(payload)}`
        );
      } catch (e) {
        // ignore stringify errors
      }
    }

    await axios.post(url, payload, { headers, timeout: Number(process.env.LOG_TIMEOUT_MS) || 5000 });
    return true;
  } catch (err: any) {
    // Best-effort: do not throw — logging should not crash the app
    // Print to console as fallback. Include HTTP response data when available.
    if (err?.response) {
      console.error(
        `[logger] failed to send log: status=${err.response.status} data=${JSON.stringify(err.response.data)}`
      );
    } else {
      console.error("[logger] failed to send log:", err?.message || err);
    }
    return false;
  }
}
