const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "leave",
  options: [],
  description: "Leave the channel",
  run: async (client, message) => {
    if (!message.guildId) return;

    const player = client.lavalink.getPlayer(message.guildId);
    if (!player)
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Blue")
            .setDescription("Bot is not connected!"),
        ],
      });
    await player.disconnect();
    return message.channel.send({
      embeds: [
        new EmbedBuilder().setColor("Blue").setDescription("Disconnected!"),
      ],
    });
  },
};
