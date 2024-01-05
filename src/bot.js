const { Client, GatewayIntentBits } = require('discord.js')
const { LavalinkManager } = require('lavalink-client')
const handleLavalinkEvents = require('./lavalink/lavalink')
require('dotenv').config()

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent
  ]
})

client.lavalink = new LavalinkManager({
  nodes: [
    {
      authorization: process.env.LAVALINK_PASS,
      host: process.env.LAVALINK_NAME,
      port: parseInt(process.env.LAVALINK_PORT),
      id: process.env.LAVALINK_ID,
      secure: Boolean(process.env.LAVALINK_SECURE)
    }
  ],
  sendToShard: (guildId, payload) =>
    client.guilds.cache.get(guildId)?.shard?.send(payload),
  client: {
    id: process.env.CLIENT_ID,
    username: client.username
  },
  autoSkip: true,
  playerOptions: {
    clientBasedPositionUpdateInterval: 150,
    defaultSearchPlatform: 'ytsearch',
    // requesterTransformer: requesterTransformer,
    onDisconnect: {
      autoReconnect: false,
      destroyPlayer: true
    },
    onEmptyQueue: {
      destroyAfterMs: 300_000
    }
  },
  queueOptions: {
    maxPreviousTracks: 10
  }
})

handleLavalinkEvents(client)

client.prefix = process.env.PREFIX
client.login(process.env.TOKEN)

module.exports = client
