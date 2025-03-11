import { TEAM_TO_ROLE_MAPPING } from "../config/config.js";

export function findRoleNameForTeam(teamName) {
  const teamLower = teamName.toLowerCase();

  for (const [team, role] of Object.entries(TEAM_TO_ROLE_MAPPING)) {
    if (
      teamLower.includes(team.toLowerCase()) ||
      team.toLowerCase().includes(teamLower)
    ) {
      return role;
    }
  }

  return null;
}

export function isTeamRelated(monitoredTeam, teamName) {
  const monitoredLower = monitoredTeam.toLowerCase();
  const teamLower = teamName.toLowerCase();

  return (
    monitoredLower === teamLower ||
    monitoredLower.includes(teamLower) ||
    teamLower.includes(monitoredLower)
  );
}

export function didTeamLose(team, match) {
  const teamLower = team.toLowerCase();
  const homeTeamLower = match.homeTeam.toLowerCase();
  const awayTeamLower = match.awayTeam.toLowerCase();

  const isHomeTeam =
    homeTeamLower.includes(teamLower) || teamLower.includes(homeTeamLower);
  const isAwayTeam =
    awayTeamLower.includes(teamLower) || teamLower.includes(awayTeamLower);

  if (isHomeTeam && match.homeScore < match.awayScore) {
    return true;
  } else if (isAwayTeam && match.awayScore < match.homeScore) {
    return true;
  }

  return false;
}
