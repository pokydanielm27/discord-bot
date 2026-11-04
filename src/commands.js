const { SlashCommandBuilder } = require('discord.js');

const definitions = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check the bot websocket latency'),
  new SlashCommandBuilder()
    .setName('status')
    .setDescription('Show how long the bot has been online and how many servers it is in'),
];

const handlers = {
  async ping(interaction) {
    await interaction.reply(`Pong - ${Math.round(interaction.client.ws.ping)}ms`);
  },
  async status(interaction) {
    const { client } = interaction;
    const seconds = Math.floor((client.uptime || 0) / 1000);
    const servers = client.guilds.cache.size;
    await interaction.reply(
      `Online as ${client.user.username} for ${formatDuration(seconds)} across ${servers} server(s).`
    );
  },
};

function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours) return `${hours}h ${minutes}m`;
  if (minutes) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

module.exports = { definitions, handlers, formatDuration };
