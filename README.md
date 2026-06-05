# Notification App (FE)

This is a minimal React + Vite TypeScript scaffold for the notification frontend.

Quick start:

```bash
cd QUESTION1-Frontend/notification_app_fe
npm install
npm run dev
```

- Open http://localhost:5173
- Click **Send Test Log** to POST a sample payload to the default log URL.

Config:
- Set `VITE_LOG_URL` in an `.env` file to change the log endpoint.
- Set `VITE_NOTIF_URL` and `VITE_LOG_TOKEN` in an `.env` file to change the notifications endpoint and token.

Run dev on required port 3000 (Vite is configured to listen on port 3000):

```bash
npm run dev
```

Notes:
- This is a simple demo app; adapt components and data fetching to your backend.
