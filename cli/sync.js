/**
 * TermAssist CLI — Sync Module
 * 
 * Posts query logs to the TermAssist dashboard API.
 * Fire-and-forget — never blocks terminal output.
 */

const https = require('https');
const http  = require('http');
const { URL } = require('url');

/**
 * Log a query to the dashboard API
 * @param {Object} queryData - { query_text, matched_command, category, response_time_ms, success }
 * @param {Object} config - { api_token, api_url, sync_enabled }
 */
async function logQuery(queryData, config) {
  if (!config.sync_enabled || !config.api_token || !config.api_url) {
    return;
  }

  const url = new URL('/api/queries', config.api_url);
  const isHttps = url.protocol === 'https:';
  const lib = isHttps ? https : http;

  const body = JSON.stringify(queryData);

  return new Promise((resolve, reject) => {
    const req = lib.request(
      {
        hostname: url.hostname,
        port: url.port || (isHttps ? 443 : 80),
        path: url.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
          'Authorization': `Bearer ${config.api_token}`,
        },
        timeout: 5000,
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => resolve(data));
      }
    );

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });

    req.write(body);
    req.end();
  });
}

module.exports = { logQuery };
