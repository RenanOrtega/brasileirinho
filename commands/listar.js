import { getServerConfig } from "../data/serverConfigs.js";

export async function listarCommand(client, message, args) {
  const serverId = message.guild.id;
  const config = getServerConfig(serverId);

  if (!config || !config.teams || config.teams.length === 0) {
    return message.reply("Nenhum time configurado para este servidor ainda.");
  }

  const teams = config.teams;
  const channelId = config.channelId;

  message.reply(
    `Times monitorados: ${teams.join(
      ", "
    )}\nCanal de notificações: <#${channelId}>`
  );
}
