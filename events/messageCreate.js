import { PREFIX, CHANNEL_ID } from "../config/config.js";
import { executeCommand } from "../commands/index.js";

export async function messageCreateHandler(client, message) {
  if (message.content === "!times" && message.channel.id === CHANNEL_ID) {
    const sentMessage = await message.channel.send(
      "Escolha seu time clicando no emoji correspondente!"
    );

    await sentMessage.react("<:sao_paulo:1347382948214739004>");
    await sentMessage.react("<:palmeiras:1347383616442732614>");
    await sentMessage.react("<:corinthians:1347383067030982697>");
    await sentMessage.react("<:santos:1347383687234326548>");
    return;
  }

  if (message.author.bot || !message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  await executeCommand(client, message, commandName, args);
}
