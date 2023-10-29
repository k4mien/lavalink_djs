const { EmbedBuilder, lazy} = require("discord.js");
const formatMS_HHMMSS = require("../utils/time")

module.exports = async function (client) {
  client.lavalink
    .on("playerCreate", (player) => {
      console.log(player.guildId, " :: Created a Player :: ");
    })
    .on("playerDestroy", (player, reason) => {
      console.log(player.guildId, " :: Player got Destroyed :: ");
      const channel = client.channels.cache.get(player.textChannelId);
      if (!channel) return;
      channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Purple")
            .setDescription(
              `${reason}` === "QueueEmpty"
                ? "I left the channel due to inactivity!"
                : `${reason}`
            ),
        ],
      });
    })
    .on("playerDisconnect", (player, voiceChannelId) => {
      console.log(
        player.guildId,
        " :: Player disconnected the Voice Channel :: ",
        voiceChannelId
      );
      const channel = client.channels.cache .get(player.textChannelId);
      if (!channel) return;
      channel.send({
        embeds: [
          new EmbedBuilder().setColor("Purple").setDescription("Disconnected!"),
        ],
      });
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
      // console.log(
      //   player.guildId,
      //   " :: Started Playing :: ",
      //   track.info.title,
      //   "QUEUE:",
      //   player.queue.tracks.map((v) => v.info.title)
      // );
      const channel = client.channels.cache.get(player.textChannelId);
      if (!channel) return;
      channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Purple")
            .setTitle("Now playing")
            .setDescription(
              `[${track.info.title}](${track.info.uri}) - \`[${formatMS_HHMMSS(track.info.duration)}]\``
            )
            .setThumbnail(
              track.info.artworkUrl || track.pluginInfo?.artistArtworkUrl || null
            ),
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
            .setColor("Purple")
            .setDescription("The queue has ended!"),
        ],
      });
    })
    .on("playerUpdate", (player) => {
      // use this event to udpate the player in the your cache if you want to save the player's data(s) externally!
      /**
       *
       */
    });
};
