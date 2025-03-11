import { EmbedBuilder } from "discord.js";
import {
  searchTeamResults,
  isMatchProcessed,
  markMatchAsProcessed,
} from "./matchService.js";
import {
  didTeamLose,
  findRoleNameForTeam,
  isTeamRelated,
} from "../utils/teamUtils.js";

import {
  getAllMonitoredTeams,
  getAllServerConfigs,
} from "../data/serverConfigs.js";

import { XINGAMENTOS } from "../config/config.js";

export async function sendLoss(client) {
  const serverConfigs = getAllServerConfigs();
  const config = serverConfigs["1347305813735243817"];
  const channel = client.channels.cache.get(config.channelId);

  const winnerTeam = "Palmeiras";
  const loserTeam = "São Paulo";

  const roleName = findRoleNameForTeam(loserTeam);
  let roleTag = "";

  if (roleName) {
    const guild = client.guilds.cache.get("1347305813735243817");
    if (guild) {
      const role = guild.roles.cache.find((r) => r.name === roleName);
      if (role) {
        roleTag = `<@&${role.id}> `;
      }
    }
  }

  const mensagem = XINGAMENTOS[Math.floor(Math.random() * XINGAMENTOS.length)]
    .replace("{role}", roleTag)
    .replace("{team}", loserTeam);

  const embed = new EmbedBuilder()
    .setColor("#FF0000")
    .setTitle(`${loserTeam} PERDEU! 🤣`)
    .setDescription(mensagem)
    .addFields({
      name: "Placar",
      value: `${winnerTeam} 1 x 0 ${loserTeam}`,
    });

  await channel.send({ embeds: [embed] });
}

export async function checkAllResults(client) {
  console.log("Verificando resultados para todos os times monitorados...");

  try {
    const allMonitoredTeams = getAllMonitoredTeams();

    if (allMonitoredTeams.size === 0) {
      console.log("Nenhum time configurado para monitoramento");
      return;
    }

    for (const team of allMonitoredTeams) {
      await checkTeamResults(client, team);
    }
  } catch (error) {
    console.error("Erro ao verificar resultados:", error);
  }
}

async function checkTeamResults(client, team) {
  console.log(`Verificando resultados para: ${team}`);

  try {
    const matches = await searchTeamResults(team);
    console.log(`Encontradas ${matches.length} partidas para ${team}`);

    for (const match of matches) {
      if (isMatchProcessed(match.matchId)) {
        continue;
      }

      markMatchAsProcessed(match.matchId);

      if (didTeamLose(team, match)) {
        console.log(
          `${team} perdeu a partida: ${match.homeTeam} ${match.homeScore} x ${match.awayScore} ${match.awayTeam}`
        );

        await notifyServersAboutLoss(client, team, match);
      }
    }
  } catch (error) {
    console.error(`Erro ao verificar resultados para ${team}:`, error);
  }
}

async function notifyServersAboutLoss(client, team, match) {
  const serverConfigs = getAllServerConfigs();
  const teamLower = team.toLowerCase();

  for (const serverId in serverConfigs) {
    const config = serverConfigs[serverId];
    if (!config.teams || !config.channelId) continue;

    const monitoredTeams = config.teams.map((t) => t.toLowerCase());

    if (monitoredTeams.some((t) => isTeamRelated(t, teamLower))) {
      const channel = client.channels.cache.get(config.channelId);
      if (!channel) continue;

      const roleName = findRoleNameForTeam(team);
      let roleTag = "";

      if (roleName) {
        const guild = client.guilds.cache.get(serverId);
        if (guild) {
          const role = guild.roles.cache.find((r) => r.name === roleName);
          if (role) {
            roleTag = `<@&${role.id}> `;
          }
        }
      }

      const mensagem = XINGAMENTOS[
        Math.floor(Math.random() * XINGAMENTOS.length)
      ]
        .replace("{role}", roleTag)
        .replace("{team}", team);

      const embed = new EmbedBuilder()
        .setColor("#FF0000")
        .setTitle(`${team} PERDEU! 🤣`)
        .setDescription(mensagem)
        .addFields({
          name: "Placar",
          value: `${match.homeTeam} ${match.homeScore} x ${match.awayScore} ${match.awayTeam}`,
        });

      await channel.send({ embeds: [embed] });
      console.log(
        `Notificação de derrota enviada para ${team} no servidor ${serverId}`
      );
    }
  }
}
