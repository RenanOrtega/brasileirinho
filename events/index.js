import { readyHandler } from "./ready.js";
import { messageCreateHandler } from "./messageCreate.js";
import { messageReactionAddHandler } from "./messageReactionAdd.js";
import { messageReactionRemoveHandler } from "./messageReactionRemove.js";

export function registerEvents(client) {
  client.once("ready", () => readyHandler(client));

  client.on("messageCreate", (message) =>
    messageCreateHandler(client, message)
  );

  client.on("messageReactionAdd", async (reaction, user) => {
    await messageReactionAddHandler(client, reaction, user);
  });

  client.on("messageReactionRemove", async (reaction, user) => {
    await messageReactionRemoveHandler(client, reaction, user);
  });
}
