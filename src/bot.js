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
    },
  ],
  sendToShard: (guildId, payload) =>
    client.guilds.cache.get(guildId)?.shard?.send(payload),
  client: {
    id: process.env.CLIENT_ID,
    username: client.user,
  },
  // everything down below is optional
  autoSkip: true,
  playerOptions: {
    clientBasedPositionUpdateInterval: 150,
    defaultSearchPlatform: "ytmsearch",
    volumeDecrementer: 0.75,
    //requesterTransformer: requesterTransformer,
    onDisconnect: {
      autoReconnect: true,
      destroyPlayer: false,
    },
    onEmptyQueue: {
      destroyAfterMs: 30_000,
      //autoPlayFunction: autoPlayFunction,
    },
  },
  queueOptions: {
    maxPreviousTracks: 25,
  },
});

client.lavalink.nodeManager
  .on("raw", (node, payload) => {
    // console.log(node.id, " :: RAW :: ", payload);
  })
  .on("disconnect", (node, reason) => {
    console.log(node.id, " :: DISCONNECT :: ", reason);
  })
  .on("connect", (node) => {
    console.log(node.id, " :: CONNECTED :: ");
  })
  .on("reconnecting", (node) => {
    console.log(node.id, " :: RECONNECTING :: ");
  })
  .on("create", (node) => {
    console.log(node.id, " :: CREATED :: ");
  })
  .on("destroy", (node) => {
    console.log(node.id, " :: DESTROYED :: ");
  })
  .on("error", (node, error, payload) => {
    console.log(node.id, " :: ERRORED :: ", error, " :: PAYLOAD :: ", payload);
  });

client.lavalink
  .on("playerCreate", (player) => {
    console.log(player.guildId, " :: Created a Player :: ");
  })
  .on("playerDestroy", (player, reason) => {
    console.log(player.guildId, " :: Player got Destroyed :: ");
    const channel = client.channels.cache.get(player.textChannelId);
    if (!channel) return console.log("No Channel?", player);
    channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor("Red")
          .setTitle("❌ Player Destroyed")
          .setDescription(`Reason: ${reason || "Unknown"}`)
          .setTimestamp(),
      ],
    });
  })
  .on("playerDisconnect", (player, voiceChannelId) => {
    console.log(
      player.guildId,
      " :: Player disconnected the Voice Channel :: ",
      voiceChannelId
    );
  })
  .on("playerMove", (player, oldVoiceChannelId, newVoiceChannelId) => {
    console.log(
      player.guildId,
      " :: Player moved from Voice Channel :: ",
      oldVoiceChannelId,
      " :: To ::",
      newVoiceChannelId
    );
  })
  .on("playerSocketClosed", (player, payload) => {
    console.log(
      player.guildId,
      " :: Player socket got closed from lavalink :: ",
      payload
    );
  });

/**
 * Queue/Track Events
 */
client.lavalink
  .on("trackStart", (player, track) => {
    console.log(
      player.guildId,
      " :: Started Playing :: ",
      track.info.title,
      "QUEUE:",
      player.queue.tracks.map((v) => v.info.title)
    );
    const channel = client.channels.cache.get(player.textChannelId);
    if (!channel) return;
    channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor("Blurple")
          .setTitle(`🎶 ${track.info.title}`.substring(0, 256))
          .setURL(track.info.uri)
          .setThumbnail(
            track.info.artworkUrl || track.pluginInfo?.artworkUrl || null
          )
          .setDescription(
            [
              `> - **Author:** ${track.info.author}`,
              `> - **Duration:** ${formatMS_HHMMSS(
                track.info.duration
              )} | Ends <t:${Math.floor(
                (Date.now() + track.info.duration) / 1000
              )}:R>`,
              `> - **Source:** ${track.info.sourceName}`,
              `> - **Requester:** <@${track.requester.id}>`,
              track.pluginInfo?.clientData?.fromAutoplay
                ? `> *From Autoplay* ✅`
                : undefined,
            ]
              .filter((v) => typeof v === "string" && v.length)
              .join("\n")
              .substring(0, 4096)
          )
          .setFooter({
            text: `Requested by ${track.requester.username}`,
            iconURL: track.requester.avatar || undefined,
          })
          .setTimestamp(),
      ],
    });
  })
  .on("trackEnd", (player, track, payload) => {
    console.log(player.guildId, " :: Finished Playing :: ", track.info.title);
  })
  .on("trackError", (player, track, payload) => {
    console.log(
      player.guildId,
      " :: Errored while Playing :: ",
      track.info.title,
      " :: ERROR DATA :: ",
      payload
    );
  })
  .on("trackStuck", (player, track, payload) => {
    console.log(
      player.guildId,
      " :: Got Stuck while Playing :: ",
      track.info.title,
      " :: STUCKED DATA :: ",
      payload
    );
  })
  .on("queueEnd", (player, track, payload) => {
    console.log(
      player.guildId,
      " :: No more tracks in the queue, after playing :: ",
      track.info.title
    );
    const channel = client.channels.cache.get(player.textChannelId);
    if (!channel) return;
    channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor("Red")
          .setTitle("❌ Queue Ended")
          .setTimestamp(),
      ],
    });
  })
  .on("playerUpdate", (player) => {
    // use this event to udpate the player in the your cache if you want to save the player's data(s) externally!
    /**
     *
     */
  });

client.prefix = process.env.PREFIX;
client.login(process.env.TOKEN);

module.exports = client;
