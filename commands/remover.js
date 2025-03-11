import { PermissionsBitField } from "discord.js";
import {
  getServerConfig,
  updateServerConfig,
  saveServerConfigs,
} from "../data/serverConfigs.js";

export async function removerCommand(client, message, args) {
  if (
    !message.member.permissions.has(PermissionsBitField.Flags.Administrator)
  ) {
    return message.reply(
      "Você precisa ser administrador para usar este comando."
    );
  }

  const serverId = message.guild.id;
  const config = getServerConfig(serverId);

  if (!config || !config.teams) {
    return message.reply("Nenhum time configurado para este servidor ainda.");
  }

  if (args.length === 0) {
    return message.reply(
      "Por favor, especifique pelo menos um time para remover."
    );
  }

  const currentTeams = new Set(config.teams);
  args.forEach((team) => currentTeams.delete(team));

  updateServerConfig(serverId, {
    teams: Array.from(currentTeams),
  });

  await saveServerConfigs();

  message.reply(
    `Times removidos: ${args.join(", ")}\nTimes restantes: ${Array.from(
      currentTeams
    ).join(", ")}`
  );
}
