import puppeteer from "puppeteer";
import { TEAM_URLS } from "../config/config.js";
import {
  processedMatchesCache,
  trimProcessedMatchesCache,
} from "../data/serverConfigs.js";

export async function searchTeamResults(teamName) {
  console.log(`Buscando último resultado para o time: ${teamName}`);

  const teamLower = teamName.toLowerCase();

  // Get the correct URL for the team
  const teamUrl =
    TEAM_URLS[teamLower] ||
    TEAM_URLS[
      Object.keys(TEAM_URLS).find(
        (key) => key.includes(teamLower) || teamLower.includes(key)
      )
    ];

  if (!teamUrl) {
    console.error(`URL do GE não encontrada para o time: ${teamName}`);
    return [];
  }

  console.log(`Acessando URL do time: ${teamUrl}`);

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  try {
    await page.goto(teamUrl, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    // Wait for the match elements to load
    await page.waitForSelector(".sc-eldPxv", { timeout: 30000 });

    const lastMatch = await page.evaluate(() => {
      // Select only the first (most recent) match container
      const container = document.querySelector(".sc-eldPxv");

      if (!container) return null;

      try {
        // Get match date
        const dateElement = container.querySelector(".sc-jXbUNg");
        const date = dateElement ? dateElement.textContent.trim() : "";

        // Get competition
        const competitionElement = container.querySelector(
          ".sc-jXbUNg:first-child"
        );
        const competition = competitionElement
          ? competitionElement.textContent.trim()
          : "";

        // Get stadium
        const stadiumElement = container.querySelector(".sc-jXbUNg:last-child");
        const stadium = stadiumElement ? stadiumElement.textContent.trim() : "";

        // Get team names
        const homeTeamElement = container.querySelector(
          ".sc-bmzYkS:first-child .sc-eeDRCY"
        );
        const awayTeamElement = container.querySelector(
          ".sc-bmzYkS:last-child .sc-eeDRCY"
        );

        if (!homeTeamElement || !awayTeamElement) return null;

        const homeTeam = homeTeamElement.textContent.trim();
        const awayTeam = awayTeamElement.textContent.trim();

        // Get scores
        const homeScoreElement = container.querySelector(
          ".sc-bmzYkS:first-child .sc-jsJBEP"
        );
        const awayScoreElement = container.querySelector(
          ".sc-bmzYkS:last-child .sc-jsJBEP"
        );

        if (!homeScoreElement || !awayScoreElement) return null;

        const homeScore = parseInt(homeScoreElement.textContent.trim());
        const awayScore = parseInt(awayScoreElement.textContent.trim());

        if (isNaN(homeScore) || isNaN(awayScore)) return null;

        // Get match ID from link
        let matchId = `${homeTeam}-${awayTeam}-${date}`;
        const linkElement = container.querySelector("a");
        if (linkElement && linkElement.href) {
          const urlMatch = linkElement.href.match(
            /\/jogo\/(\d{2}-\d{2}-\d{4})\/([^\/]+)-([^\/]+)\.ghtml/
          );
          if (urlMatch) {
            matchId = urlMatch[0];
          }
        }

        return {
          homeTeam,
          awayTeam,
          homeScore,
          awayScore,
          matchId,
          date,
          competition,
          stadium,
        };
      } catch (error) {
        console.log("Erro ao processar partida:", error);
        return null;
      }
    });

    await browser.close();

    // Return an array with just the last match or an empty array if no match was found
    return lastMatch ? [lastMatch] : [];
  } catch (error) {
    console.error(`Erro ao buscar resultados para ${teamName}:`, error);
    await browser.close();
    return [];
  }
}

export function isMatchProcessed(matchId) {
  return processedMatchesCache.has(matchId);
}

export function markMatchAsProcessed(matchId) {
  processedMatchesCache.add(matchId);
  trimProcessedMatchesCache();
}
