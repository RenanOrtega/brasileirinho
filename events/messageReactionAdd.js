import { CHANNEL_ID, TEAM_ROLES } from "../config/config.js";

export async function messageReactionAddHandler(client, reaction, user) {
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
  if (!role) {
    console.log(`Cargo não encontrado: ${roleName}`);
    return;
  }

  const teamRolesIds = Object.values(TEAM_ROLES)
    .map((name) => guild.roles.cache.find((r) => r.name === name)?.id)
    .filter(Boolean);
  await member.roles.remove(teamRolesIds);

  await member.roles.add(role);
  console.log(`Cargo ${roleName} adicionado para ${member.user.tag}`);
}
