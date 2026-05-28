require("dotenv").config();

const axios = require("axios");

const API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNELS = [
  "UCT5RHtbdXygakop8SIC8C4Q",
  "UC_P1_tHYVDhrjnyOptr3qKQ"
];
const WEBHOOK = process.env.DISCORD_WEBHOOK;

let latestVideo = "";

const sentVideos = new Set();

async function checkYouTube() {
  try {

    for (const CHANNEL_ID of CHANNELS) {

      const url =
        `https://www.googleapis.com/youtube/v3/search` +
        `?key=${API_KEY}` +
        `&channelId=${CHANNEL_ID}` +
        `&part=snippet,id` +
        `&order=date` +
        `&maxResults=1`;

      const response = await axios.get(url);

      const item = response.data.items[0];

      if (!item.id.videoId) continue;

      const videoId = item.id.videoId;

      if (sentVideos.has(videoId)) continue;

      sentVideos.add(videoId);

      const title = item.snippet.title;
      const channel = item.snippet.channelTitle;
      const type = item.snippet.liveBroadcastContent;
  

      let emoji = "📺";
      let status = "Upload Baru";

      if (type === "live") {
        emoji = "🔴";
        status = "LIVE SEKARANG";
      }

      if (type === "upcoming") {
        emoji = "🟠";
        status = "LIVE UPCOMING";
      }

      const videoUrl = `https://youtu.be/${videoId}`;

      await axios.post(WEBHOOK, {
        content:
`${emoji} ${status} — ${channel}

**${title}**

${videoUrl}`
      });

      console.log("Notif terkirim:", title);
    }

  } catch (err) {
    console.error(err.response?.data || err.message);
  }
}

console.log("Bot berjalan...");

checkYouTube();

setInterval(checkYouTube, 60000);