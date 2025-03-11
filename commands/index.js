import { configurarCommand } from "./configurar.js";
import { listarCommand } from "./listar.js";
import { removerCommand } from "./remover.js";
import { verificarCommand } from "./verificar.js";
import { ajudaCommand } from "./ajuda.js";
import { buscarCommand } from "./buscar.js";

const commands = {
  configurar: configurarCommand,
  listar: listarCommand,
  remover: removerCommand,
  verificar: verificarCommand,
  ajuda: ajudaCommand,
  buscar: buscarCommand,
};

export async function executeCommand(client, message, commandName, args) {
  const command = commands[commandName];

  if (!command) {
    return message.reply(
      `Comando desconhecido. Use \`!ajuda\` para ver a lista de comandos disponíveis.`
    );
  }

  try {
    await command(client, message, args);
  } catch (error) {
    console.error(`Erro ao executar o comando ${commandName}:`, error);
    message.reply("Ocorreu um erro ao executar este comando.");
  }
}
