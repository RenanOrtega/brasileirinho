import { CHANNEL_ID, TEAM_ROLES } from "../config/config.js";

export async function messageReactionRemoveHandler(client, reaction, user) {
  if (user.bot || reaction.message.channel.id !== CHANNEL_ID) return;

  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (error) {
      console.error("Erro ao carregar a reação:", error);
      return;
    }
  }

  const guild = reaction.message.guild;
  const member = guild.members.cache.get(user.id);

  const emojiId = reaction.emoji.id;
  const roleName = TEAM_ROLES[emojiId];

  if (!roleName || !member) return;

  const role = guild.roles.cache.find((r) => r.name === roleName);
  if (role) {
    await member.roles.remove(role);
    console.log(`Cargo ${roleName} removido de ${member.user.tag}`);
  }
}
