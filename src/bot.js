const { Client, GatewayIntentBits } = require("discord.js");
const { LavalinkManager } = require("lavalink-client");
const handleLavalinkEvents = require("./lavalink/lavalink");
require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
});

client.lavalink = new LavalinkManager({
  nodes: [
    {
      authorization: process.env.LAVALINK_PASS,
      host: process.env.LAVALINK_NAME,
      port: 2333,
      id: "testnode",
    },
  ],
  sendToShard: (guildId, payload) =>
    client.guilds.cache.get(guildId)?.shard?.send(payload),
  client: {
    id: process.env.CLIENT_ID,
    username: client.username,
  },
  autoSkip: true,
  playerOptions: {
    clientBasedPositionUpdateInterval: 150,
    defaultSearchPlatform: "ytsearch",
    //requesterTransformer: requesterTransformer,
    onDisconnect: {
      autoReconnect: true,
      destroyPlayer: true,
    },
    onEmptyQueue: {
      destroyAfterMs: 30_000,
    },
  },
  queueOptions: {
    maxPreviousTracks: 25,
  },
});

handleLavalinkEvents(client);

client.prefix = process.env.PREFIX;
client.login(process.env.TOKEN);

module.exports = client;
