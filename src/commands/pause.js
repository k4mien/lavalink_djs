const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "pause",
  description: "Pause the queue",
  options: [],
  inVoiceChannel: true,
  run: async (client, message) => {
    if (!message.guildId) return;

    const player = client.lavalink.getPlayer(message.guildId);
    const queue = player.queue;

    if (!player)
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Blue")
            .setDescription("Player is not connected!"),
        ],
      });

    if (!queue)
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Blue")
            .setDescription("There is nothing in the queue right now!"),
        ],
      });

    if (player.paused) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Blue")
            .setDescription("The current song is already paused!"),
        ],
      });
    } else {
      await player.pause();
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Blue")
            .setDescription("Paused the song for you :)"),
        ],
      });
    }
  },
};
