import { log } from './logger';

async function main() {
  const tokenArg = process.argv[2];
  const token = tokenArg || process.env.LOG_SERVER_TOKEN;

  const success = await log(
    'auth-service',
    'error',
    'affordmed-logging-middleware',
    'Test from test-log.ts',
    token ? { token } : undefined
  );

  if (success) {
    console.log('Log sent successfully');
  } else {
    console.log('Log send failed (see error above)');
  }
}

main().catch((e) => {
  console.error('Unexpected error running test-log:', e);
  process.exit(1);
});
