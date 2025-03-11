import { EmbedBuilder } from "discord.js";
import { searchTeamResults } from "../services/matchService.js";

export async function buscarCommand(client, message, args) {
  if (args.length === 0) {
    return message.reply("Por favor, especifique o nome do time para buscar.");
  }

  const teamName = args.join(" ");
  message.reply(`Buscando resultados para ${teamName}...`);

  try {
    const results = await searchTeamResults(teamName);

    if (results.length === 0) {
      return message.reply(
        `Não encontrei resultados recentes para ${teamName}.`
      );
    }

    const embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle(`Resultados para ${teamName}`)
      .setTimestamp()
      .setFooter({ text: "Dados obtidos do Sofascore" });

    for (const match of results.slice(0, 5)) {
      embed.addFields({
        name: `${match.date || "Data desconhecida"}`,
        value: `${match.homeTeam} ${match.homeScore} x ${match.awayScore} ${match.awayTeam}`,
      });
    }

    message.reply({ embeds: [embed] });
  } catch (error) {
    console.error("Erro ao buscar resultados:", error);
    message.reply(
      "Ocorreu um erro ao buscar os resultados. Tente novamente mais tarde."
    );
  }
}
