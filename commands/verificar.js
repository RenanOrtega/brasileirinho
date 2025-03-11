import { checkAllResults } from "../services/matchChecker.js";

export async function verificarCommand(client, message, args) {
  message.reply("Verificando resultados recentes...");

  try {
    await checkAllResults(client);
    message.reply("Verificação concluída!");
  } catch (error) {
    console.error("Erro ao verificar resultados:", error);
    message.reply("Ocorreu um erro durante a verificação.");
  }
}
