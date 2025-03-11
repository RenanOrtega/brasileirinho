import { PermissionsBitField } from "discord.js";
import {
  updateServerConfig,
  saveServerConfigs,
} from "../data/serverConfigs.js";

export async function configurarCommand(client, message, args) {
  if (
    !message.member.permissions.has(PermissionsBitField.Flags.Administrator)
  ) {
    return message.reply(
      "Você precisa ser administrador para usar este comando."
    );
  }

  let channelId = message.channel.id;

  if (args.length > 0 && args[0].match(/^\d+$/)) {
    channelId = args.shift();
  }

  if (args.length === 0) {
    return message.reply(
      "Por favor, especifique pelo menos um time para monitorar."
    );
  }

  const serverId = message.guild.id;
  updateServerConfig(serverId, {
    channelId: channelId,
    teams: args,
    lastChecked: new Date().toISOString(),
  });

  await saveServerConfigs();

  message.reply(
    `Configuração salva! Monitorando os times: ${args.join(
      ", "
    )} no canal <#${channelId}>`
  );
}
