import fs from "fs/promises";
import { existsSync } from "fs";
import { CONFIG_FILE } from "../config/config.js";

let serverConfigs = {};

export const processedMatchesCache = new Set();

export async function loadServerConfigs() {
  try {
    if (existsSync(CONFIG_FILE)) {
      const data = await fs.readFile(CONFIG_FILE, "utf8");
      serverConfigs = JSON.parse(data);
    }
  } catch (error) {
    console.error("Erro ao carregar configurações:", error);
    serverConfigs = {};
  }
}

export async function saveServerConfigs() {
  try {
    await fs.writeFile(CONFIG_FILE, JSON.stringify(serverConfigs, null, 2));
  } catch (error) {
    console.error("Erro ao salvar configurações:", error);
  }
}

export function getServerConfig(serverId) {
  return serverConfigs[serverId] || null;
}

export function getAllServerConfigs() {
  return serverConfigs;
}

export function updateServerConfig(serverId, config) {
  if (!serverConfigs[serverId]) {
    serverConfigs[serverId] = {};
  }

  serverConfigs[serverId] = { ...serverConfigs[serverId], ...config };
}

export function getAllMonitoredTeams() {
  const allMonitoredTeams = new Set();

  for (const serverId in serverConfigs) {
    const config = serverConfigs[serverId];
    if (config.teams && config.teams.length > 0) {
      config.teams.forEach((team) => allMonitoredTeams.add(team));
    }
  }

  return allMonitoredTeams;
}

export function trimProcessedMatchesCache() {
  if (processedMatchesCache.size > 1000) {
    const cacheArray = Array.from(processedMatchesCache);
    processedMatchesCache.clear();
    cacheArray
      .slice(cacheArray.length - 500)
      .forEach((item) => processedMatchesCache.add(item));
  }
}
