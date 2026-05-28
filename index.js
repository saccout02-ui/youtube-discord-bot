const startup = Date.now();
require("dotenv").config();
const published =
  new Date(item.snippet.publishedAt).getTime();

if (published < startup) continue;
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

     const thumb =
  item.snippet.thumbnails.high?.url ||
  item.snippet.thumbnails.default?.url;

const channelIcon =
  item.snippet.thumbnails.default?.url;

let color = 0x5865F2;

if (type === "live") {
  color = 0xFF0000;
}

if (type === "upcoming") {
  color = 0xFFA500;
}

const embed = {
  color: color,

  author: {
    name: channel,
    icon_url: channelIcon,
    url: `https://youtube.com/channel/${CHANNEL_ID}`
  },

  title:
    type === "live"
      ? "🔴 LIVE SEKARANG"
      : type === "upcoming"
      ? "🟠 LIVE UPCOMING"
      : "📺 Upload Baru",

  description:
`## ${title}

Klik tombol di bawah untuk menonton.`,

  url: videoUrl,

  thumbnail: {
    url: thumb
  },

  image: {
    url: thumb
  },

  fields: [
    {
      name: "Channel",
      value: channel,
      inline: true
    },
    {
      name: "Type",
      value:
        type === "live"
          ? "Live Stream"
          : type === "upcoming"
          ? "Upcoming Stream"
          : "Video Upload",
      inline: true
    }
  ],

  footer: {
    text: "YouTube Notifier"
  },

  timestamp: new Date().toISOString()
};

await axios.post(WEBHOOK, {

  content:
    type === "live"
      ? "@everyone 🔴 STREAM BARU!"
      : "",

  embeds: [embed],

  components: [
    {
      type: 1,
      components: [
        {
          type: 2,
          style: 5,
          label: "▶ Watch Now",
          url: videoUrl
        }
      ]
    }
  ]

});

      console.log("Notif terkirim:", title);
    }

  } catch (err) {
    console.error(err.response?.data || err.message);
  }
}

console.log("Bot berjalan...");

checkYouTube();

setInterval(checkYouTube, 15000);