const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "skip",
  aliases: ["s"],
  description: "Skip the current song",
  options: [],
  inVoiceChannel: true,
  run: async (client, message) => {
    if (!message.guildId) return;

    const voiceChannel = message.member?.voice?.channel;
    const voiceChannelId = message.member?.voice?.channelId;
    const player = client.lavalink.getPlayer(message.guildId);

    if (!player)
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Blue")
            .setDescription("Player is not connected!"),
        ],
      });

    if (!voiceChannelId) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Blue")
            .setDescription("You have to be in a voice channel!"),
        ],
      });
    } else if (player?.voiceChannelId !== voiceChannelId) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Blue")
            .setDescription("You are in the different voice channel"),
        ],
      });
    }

    if (player.queue.tracks.length < 1) {
      await player.disconnect();
    }

    await player.skip();

    return message.channel.send({
      embeds: [
        new EmbedBuilder().setColor("Blue").setDescription("Song skipped!"),
      ],
    });
  },
};
