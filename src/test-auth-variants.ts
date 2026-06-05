import axios from 'axios';

const DEFAULT_URL = process.env.LOG_SERVER_URL || 'http://4.224.186.213/evaluation-service/logs';

const payload = {
  stack: 'auth-service',
  level: 'error',
  package: 'affordmed-logging-middleware',
  message: 'Auth variants test',
};

async function tryVariant(name: string, headers: Record<string, string> | undefined, urlOverride?: string) {
  const url = urlOverride || DEFAULT_URL;
  try {
    const res = await axios.post(url, payload, { headers, timeout: 5000 });
    console.log(`${name}: success status=${res.status} data=${JSON.stringify(res.data)}`);
  } catch (err: any) {
    if (err?.response) {
      console.log(`${name}: status=${err.response.status} data=${JSON.stringify(err.response.data)}`);
    } else {
      console.log(`${name}: error=${err?.message || err}`);
    }
  }
}

async function main() {
  const token = process.argv[2] || process.env.LOG_SERVER_TOKEN;
  if (!token) {
    console.error('Usage: node dist/test-auth-variants.js <TOKEN>  OR set LOG_SERVER_TOKEN');
    process.exit(1);
  }

  console.log('Testing auth variants against', DEFAULT_URL);

  await tryVariant('No Auth', { 'Content-Type': 'application/json' });

  await tryVariant('Bearer scheme', { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` });
  await tryVariant('Raw token (no scheme)', { 'Content-Type': 'application/json', Authorization: `${token}` });
  await tryVariant('Token scheme', { 'Content-Type': 'application/json', Authorization: `Token ${token}` });
  await tryVariant('Basic token as username (base64 token:)', { 'Content-Type': 'application/json', Authorization: `Basic ${Buffer.from(`${token}:`).toString('base64')}` });
  await tryVariant('x-api-key header', { 'Content-Type': 'application/json', 'x-api-key': token });
  await tryVariant('query param', undefined, `${DEFAULT_URL}?token=${encodeURIComponent(token)}`);

  console.log('Done');
}

main().catch((e) => {
  console.error('Error running variants:', e);
  process.exit(1);
});
