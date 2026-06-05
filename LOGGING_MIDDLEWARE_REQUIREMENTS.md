# Logging Middleware — Requirements

## 1. Purpose
Provide a lightweight, resilient logging middleware service for backend applications to send structured logs to a central evaluation service.

## 2. Scope
This document covers the logging client library and its integration requirements with the remote endpoint `http://4.224.186.213/evaluation-service/logs`.

## 3. Goals
- Reliable delivery (best-effort, non-blocking)
- Simple API for services to send logs
- Secure (token-based auth)
- Observable and testable (Postman collection + unit/integration tests)

## 4. Functional Requirements
- FR1: Provide a function `log(stack, level, package, message, opts?)` that sends a JSON payload to the configured URL.
- FR2: Support log levels: `debug`, `info`, `warn`, `error`, `fatal`.
- FR3: Allow configuration via `opts` or environment variables:
  - `LOG_SERVER_URL` (default `http://4.224.186.213/evaluation-service/logs`)
  - `LOG_SERVER_TOKEN`
  - `LOG_TIMEOUT_MS` (default 5000)
- FR4: Send `Authorization: Bearer <token>` header when token present.
- FR5: Never throw from the logger — failures are logged to console and swallowed.
- FR6: Allow caller to override headers or URL via `opts`.

## 5. API / Payload
- Endpoint: POST /evaluation-service/logs
- Headers: `Content-Type: application/json`, optional `Authorization: Bearer <token>`
- Payload schema:
```json
{
  "stack": "string",
  "level": "debug|info|warn|error|fatal",
  "package": "string",
  "message": "string"
}
```
- Expected responses:
  - 2xx: accepted
  - 4xx: client error (e.g., missing auth)
  - 5xx: server error (retry optional)

## 6. Non-functional Requirements
- NFR1: Calls must be time-limited (default 5s).
- NFR2: Client adds minimal latency to host app — asynchronous, fire-and-forget.
- NFR3: Library must be tree-shakeable and small (TypeScript source + small deps).
- NFR4: Provide unit tests for payload creation and header handling; integration tests using the Postman collection or a mocked HTTP server.

## 7. Retry / Backoff
- Best-effort: no built-in persistent retry by default.
- Optionally allow a simple retry with configurable attempt count and exponential backoff via `opts.retry` for callers that want stronger guarantees.

## 8. Security
- Use `Authorization: Bearer <token>`.
- Encourage TLS for production URLs (https).
- Do not log the full token to console.
- Support token via environment variable for servers, or `opts.token` for programmatic calls.

## 9. Observability
- When send fails, print a concise message: `[logger] failed to send log: <error>`.
- Provide an optional hook `opts.onError(err)` so host app can record failures.

## 10. Testing
- Unit tests for:
  - Payload shape and required fields
  - Header inclusion when token provided
  - Timeout behavior
- Integration tests:
  - Use Postman collection `postman/affordmed-logging-collection.json` or a local mock server

## 11. Deployment / Packaging
- Publish as a private NPM package (optional) or include via repository module.
- Transpile with `tsc` for production usage; provide `dist/` builds.

## 12. Configuration & Environment Variables
- `LOG_SERVER_URL` — overrides default url
- `LOG_SERVER_TOKEN` — token for Authorization
- `LOG_TIMEOUT_MS` — request timeout in milliseconds

## 13. Acceptance Criteria
- `log()` sends correctly-shaped JSON and includes `Authorization` when token provided.
- Library never throws on network failures.
- Postman request in `postman/` successfully returns non-401 with a valid token.
- Unit tests pass locally.

## 14. Next Steps
- Add unit tests and CI job to run them.
- Add optional retry/backoff feature behind an `opts` flag.
- Document usage in `README.md` with examples for PowerShell/Linux.
- Optionally: add batching or buffering for high-throughput use-cases.

---
Generated on 2026-06-05
