const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "play",
  aliases: ["p"],
  options: [" <url | text>"],
  description: "Play a song or playlist",
  inVoiceChannel: true,
  run: async (client, message, args) => {
    if (!message.guildId) return;

    const voiceChannel = message.member?.voice?.channel;
    const voiceChannelId = message.member?.voice?.channelId;
    if (!voiceChannelId) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Blue")
            .setDescription("You have to be in a voice channel!"),
        ],
      });
    }

    if (!voiceChannel.joinable || !voiceChannel.speakable) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Blue")
            .setDescription("I cannot join this voice channel!"),
        ],
      });
    }

    const query = args.join(" ");
    if (!query) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Blue")
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

    const connected = player.connected;

    if (!connected) await player.connect();

    if (player.voiceChannelId !== voiceChannelId)
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Blue")
            .setDescription("You have to be in a voice channel with me!"),
        ],
      });

    const response = await player.search({ query: query }, message.user);

    if (!response || !response.tracks?.length)
      return interaction.reply({ content: `No Tracks found`, ephemeral: true });

    await player.queue.add(response.tracks[0]);

    if (!player.playing)
      await player.play(
        connected ? { volume: client.defaultVolume, paused: false } : undefined
      );
  },
};
