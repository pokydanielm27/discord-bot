const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const PAGE = path.join(__dirname, 'status-page.html');

function describe(client, getLastError) {
  const error = getLastError();

  if (client.isReady()) {
    return {
      state: 'ok',
      label: `Connected as ${client.user.tag}`,
      tag: client.user.tag,
      id: client.user.id,
      guilds: client.guilds.cache.size,
      ping: Math.round(client.ws.ping),
      uptime: Math.floor((client.uptime || 0) / 1000),
      commands: client.application?.commands.cache.size ?? 0,
    };
  }

  if (error) {
    return { state: 'error', label: error };
  }

  return { state: 'waiting', label: 'Connecting to Discord...' };
}

function send(res, status, type, body) {
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(body);
}

function createStatusServer(client, getLastError) {
  return http.createServer((req, res) => {
    const url = (req.url || '/').split('?')[0];

    if (url === '/health') {
      return send(res, 200, 'application/json', '{"ok":true}');
    }

    if (url === '/api/status') {
      const bot = describe(client, getLastError);
      return send(res, 200, 'application/json', JSON.stringify({ bot }));
    }

    if (url === '/') {
      return send(res, 200, 'text/html; charset=utf-8', fs.readFileSync(PAGE));
    }

    return send(res, 404, 'text/plain', 'Not found');
  });
}

module.exports = { createStatusServer };
