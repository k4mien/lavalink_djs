const { Client, GatewayIntentBits } = require("discord.js");
const { LavalinkManager } = require("lavalink-client");
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
      // Important to have at least 1 node
      authorization: process.env.LAVALINK_PASS,
      host: "lavalink",
      port: 2333,
      id: "testnode",
      requestTimeout: 10000,
    },
  ],
  sendToShard: (guildId, payload) =>
    client.guilds.cache.get(guildId)?.shard?.send(payload),
  client: {
    id: process.env.CLIENT_ID,
    username: client.user,
  },
  autoSkip: true,
  playerOptions: {
    clientBasedPositionUpdateInterval: 150,
    defaultSearchPlatform: "ytsearch",
    volumeDecrementer: 0.75,
    //requesterTransformer: requesterTransformer,
    onDisconnect: {
      autoReconnect: true,
      destroyPlayer: false,
    },
    onEmptyQueue: {
      destroyAfterMs: 30_000,
    },
  },
  queueOptions: {
    maxPreviousTracks: 25,
  },
});

client.prefix = process.env.PREFIX;
client.login(process.env.TOKEN);

module.exports = client;
