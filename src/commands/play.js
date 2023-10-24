const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "play",
  aliases: ["p"],
  options: [" <url | text>"],
  description: "Play a song or playlist",
  inVoiceChannel: true,
  run: async (client, message, args) => {
    if (!message.guildId) return;

    const voiceChannelId = message.member?.voice?.channelId;

    if (!voiceChannelId) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Purple")
            .setDescription("You have to be in a voice channel!"),
        ],
      });
    }

    const query = args.join(" ");

    if (!query) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Purple")
            .setDescription("Please enter a song url or query to search."),
        ],
      });
    }

    const player =
      client.lavalink.getPlayer(message.guildId) ||
      (await client.lavalink.createPlayer({
        guildId: message.guildId,
        voiceChannelId: voiceChannelId,
        textChannelId: message.channelId,
        selfDeaf: true,
        selfMute: false,
        volume: client.defaultVolume, // default volume
        instaUpdateFiltersFix: true, // optional
        applyVolumeAsFilter: false, // if true player.setVolume(54) -> player.filters.setVolume(0.54)
        // node: "YOUR_NODE_ID",
        // vcRegion: (interaction.member as GuildMember)?.voice.channel?.rtcRegion!
      }));

    if (!player.connected) await player.connect();

    if (player?.voiceChannelId !== voiceChannelId) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Purple")
            .setDescription("You are in the different voice channel"),
        ],
      });
    }

    const response = await player.search({ query: query }, message.user);

    if (!response || !response.tracks?.length)
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Purple")
            .setDescription("The result not found!"),
        ],
      });

    await player.queue.add(
      response.loadType === "playlist" ? response.tracks : response.tracks[0]
    );

    await message.channel.send({
      embeds: [
        new EmbedBuilder().setColor("Purple").setDescription(
          response.loadType === "playlist"
            ? `Added ${
                response.playlist?.title
                  ? ` - from the ${response.pluginInfo.type || "Playlist"} ${
                      response.playlist.uri
                        ? `[${response.playlist.title}](<${response.playlist.uri}>)`
                        : `${response.playlist.title}`
                    }`
                  : ""
              }
                }\``
            : `Added [**${response.tracks[0].info.title}**](<${response.tracks[0].info.uri}>)`
        ),
      ],
    });

    if (!player.playing) await player.play();
  },
};
