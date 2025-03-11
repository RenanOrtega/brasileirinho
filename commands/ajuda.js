import { EmbedBuilder } from "discord.js";

export async function ajudaCommand(client, message, args) {
  const embed = new EmbedBuilder()
    .setColor("#0099ff")
    .setTitle("Comandos do Bot")
    .setDescription("Aqui estão os comandos disponíveis:")
    .addFields(
      {
        name: "!configurar [canal] [times...]",
        value:
          "Configura times para monitorar e o canal para enviar notificações",
      },
      {
        name: "!listar",
        value: "Lista os times monitorados no servidor",
      },
      {
        name: "!remover [times...]",
        value: "Remove times da lista de monitoramento",
      },
      {
        name: "!verificar",
        value: "Verifica manualmente resultados recentes",
      },
      {
        name: "!buscar [time]",
        value: "Busca resultados recentes para um time específico",
      },
      {
        name: "!times",
        value: "Exibe uma mensagem para escolher seu time favorito",
      }
    )
    .setTimestamp();

  message.reply({ embeds: [embed] });
}
