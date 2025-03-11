import { checkAllResults, sendLoss } from "../services/matchChecker.js";

export function readyHandler(client) {
  console.log(`Bot está online como ${client.user.tag}`);
  // checkAllResults(client);
  // setInterval(() => checkAllResults(client), 15 * 60 * 1000);
}
