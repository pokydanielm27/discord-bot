# discord-bot
Starter Discord bot built with discord.js

## What it does

- Signs in to Discord with `DISCORD_TOKEN` and registers two global slash commands:
  - `/ping` — current websocket latency
  - `/status` — uptime and number of servers the bot is in
- Serves a small status page on port 3000 (`/`), plus `/api/status` (JSON) and `/health`
  (used by the container healthcheck). A Discord bot has no UI of its own, so this page is
  how you can see it is alive.

## Running locally with Docker

```sh
cp .env.example .env    # then paste your bot token into DISCORD_TOKEN
docker run --rm -it -p 3000:3000 --env-file .env -v "$PWD":/app -w /app node:22-alpine \
  sh -c "npm install && npm start"
```

## Running without Docker

Requires Node.js 22 or newer.

```sh
npm install
DISCORD_TOKEN=your-token npm start   # or: npm run dev  (restarts on file changes)
```

Then open http://localhost:3000.

## Adding a command

Define it in `src/commands.js` (a `SlashCommandBuilder` entry in `definitions` and a matching
handler in `handlers`). Commands are re-registered globally on startup.

## Project layout

| File | Purpose |
| --- | --- |
| `src/index.js` | Entry point: creates the client, logs in, starts the status server |
| `src/commands.js` | Slash command definitions and handlers |
| `src/status-server.js` | HTTP status endpoints |
| `src/status-page.html` | The status page |
