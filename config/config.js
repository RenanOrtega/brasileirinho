import path from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const ROOT_DIR = path.resolve(__dirname, "..");
export const CONFIG_FILE = path.join(ROOT_DIR, "server_configs.json");
export const PREFIX = "!";
export const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
export const CHANNEL_ID = process.env.CHANNEL_ID;

export const TEAM_ROLES = {
  [process.env.ROLE_SP_ID]: "São Paulino",
  [process.env.ROLE_PAL_ID]: "Palmeirense",
  [process.env.ROLE_COR_ID]: "Corintiano",
  [process.env.ROLE_SAN_ID]: "Santista",
};

export const TEAM_TO_ROLE_MAPPING = {
  "São Paulo": "São Paulino",
  Palmeiras: "Palmeirense",
  Corinthians: "Corintiano",
  Santos: "Santista",
};

export const XINGAMENTOS = [
  "😂 AEE O {role} esse seu time é um LIXO DO CARALHO KKKKKKKKKKKKKK",
  "🤡 AEE O {role} pensa num time PÉSSIMO, é essa bosta",
  "💩 AEE O {role} papo reto, não tinha time melhor que esse pra torcer não? que vexame kkkkkk ",
  "🤣 AEE O {role} tu é muito otário pra torcer por esse resto aqui que um dia se chamou de time",
  "👋 AEE O {role} isso é profissional? KKKKKKKKKKKKKKKKKKK essa bosta é várzea não fode",
];

export const TEAM_URLS = {
  corinthians:
    "https://ge.globo.com/futebol/times/corinthians/agenda-de-jogos-do-corinthians/#/encerrados",
  santos:
    "https://ge.globo.com/sp/santos-e-regiao/futebol/times/santos/agenda-de-jogos-do-santos/#/encerrados",
  palmeiras:
    "https://ge.globo.com/futebol/times/palmeiras/agenda-de-jogos-do-palmeiras/#/encerrados",
  "são paulo":
    "https://ge.globo.com/futebol/times/sao-paulo/agenda-de-jogos-do-sao-paulo/#/encerrados",
};

export const CACHE_LIMIT = process.env.CACHE_LIMIT;
export const CACHE_TRIM_SIZE = process.env.CACHE_TRIM_SIZE;
