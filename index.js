import { Client, GatewayIntentBits } from "discord.js";
import { registerEvents } from "./events/index.js";
import { DISCORD_TOKEN } from "./config/config.js";
import { loadServerConfigs } from "./data/serverConfigs.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
});

async function initialize() {
  try {
    await loadServerConfigs();
    registerEvents(client);
    console.log(DISCORD_TOKEN);
    await client.login(DISCORD_TOKEN);
  } catch (error) {
    console.error("Erro ao inicializar o bot:", error);
    process.exit(1);
  }
}

initialize();
