// index.js

const express = require("express");
const axios = require("axios");
const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();

const app = express();
const platform = "ph2";
const summonerId = "";
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  try {
    if (message.author.bot) return;
    if (message.content === "!status") {
      const status = await getServerStatus();
      message.reply(
        `Server: ${status.id}\nLocale: ${status.name}\nMaintenance Status: ${
          status.maintenances.length > 0
            ? status.maintenances?.map((e) => `${e}\n`)
            : "All goods WATDAPAK LAGAPAK!"
        }`
      );
    } else if (message.content.split(" ")[0] === "!riot-profile") {
      const summonerName = message.content.split(" ")[1];
      console.log(summonerName);
      const profile = await getPlayerProfile(summonerName);
      if (profile.length > 0) {
        const playerData = profile[0];
        const playerName = summonerName;
        message.reply(`
          Player Name: ${playerName}
          Tier: ${playerData.tier}
          Rank: ${playerData.rank}
          League Points: ${playerData.leaguePoints}
          Wins: ${playerData.wins}
          Losses: ${playerData.losses}
        `);
      } else {
        message.reply(`No profile found for summoner ${summonerName}`);
      }
    } else if (message.content === "!matchhistory") {
      const matchHistory = await getMatchHistory("your_summoner_name");
      message.reply(`Your match history: ${matchHistory}`);
    }
  } catch (error) {
    console.error(error);
    message.reply("An error occurred while processing your request.");
  }
});

async function getServerStatus() {
  try {
    const response = await axios.get(
      `https://${platform}.api.riotgames.com/tft/status/v1/platform-data`,
      {
        headers: {
          "X-Riot-Token": process.env.RIOT_API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching TFT status:", error.response.data);
    throw error;
  }
}

async function getPlayerProfile(summonerId) {
  try {
    // Encode the summonerId to ensure it is properly formatted for the URL
    const encodedSummonerId = encodeURIComponent(summonerId);

    const response = await axios.get(
      `https://${platform}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerId}`,
      {
        headers: {
          "X-Riot-Token": process.env.RIOT_API_KEY,
        },
      }
    );

    // Handle the response data
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching TFT league entries:", error.response.data);
    throw error;
  }
}

async function getMatchHistory(summonerName) {
  // Implement logic to fetch player match history from Riot API
}

client.login(process.env.DISCORD_TOKEN);

app.listen();
