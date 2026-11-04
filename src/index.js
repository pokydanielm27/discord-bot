const { Client, Events, GatewayIntentBits } = require('discord.js');
const { definitions, handlers } = require('./commands');
const { createStatusServer } = require('./status-server');

const PORT = Number(process.env.PORT || 3000);
const TOKEN = process.env.DISCORD_TOKEN || '';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

let lastError = null;
const getLastError = () => lastError;

client.once(Events.ClientReady, async (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}`);

  try {
    await readyClient.application.commands.set(definitions.map((command) => command.toJSON()));
    console.log(`Registered ${definitions.length} slash command(s)`);
  } catch (error) {
    console.error('Could not register slash commands:', error.message);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const handler = handlers[interaction.commandName];
  if (!handler) return;

  try {
    await handler(interaction);
  } catch (error) {
    console.error(`Command /${interaction.commandName} failed:`, error);
    const message = 'That command failed. Check the bot logs.';
    if (interaction.replied) {
      await interaction.followUp(message);
    } else {
      await interaction.reply({ content: message, ephemeral: true });
    }
  }
});

client.on(Events.Error, (error) => {
  console.error('Discord client error:', error.message);
});

createStatusServer(client, getLastError).listen(PORT, '0.0.0.0', () => {
  console.log(`Status page listening on 0.0.0.0:${PORT}`);
});

if (!TOKEN) {
  lastError = 'DISCORD_TOKEN is not set';
  console.error(lastError);
} else {
  client.login(TOKEN).catch((error) => {
    lastError = `Discord login failed: ${error.message}`;
    console.error(lastError);
  });
}
