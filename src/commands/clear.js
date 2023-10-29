const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "clear",
  description: "Clear the queue",
  options: [],
  run: async (client, message) => {
    if (!message.guildId) return;

    const voiceChannelId = message.member?.voice?.channelId;
    const player = client.lavalink.getPlayer(message.guildId);

    if (!voiceChannelId) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Purple")
            .setDescription("You have to be in a voice channel!"),
        ],
      });
    }

    if (!player)
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Purple")
            .setDescription("Bot is not connected!"),
        ],
      });

    if (player?.voiceChannelId !== voiceChannelId) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Purple")
            .setDescription("You are in the different voice channel"),
        ],
      });
    }

    if ((!player.playing && !player.paused) || !player.queue.current)
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Purple")
            .setDescription("There is nothing in the queue right now!"),
        ],
      });

    if (player.queue.tracks.length) {
      await player.queue.splice(0, player.queue.tracks.length);
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Purple")
            .setDescription("Cleared the queue!"),
        ],
      });
    }
  },
};
