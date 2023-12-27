const { EmbedBuilder } = require('discord.js')

module.exports = {
  name: 'leave',
  options: [],
  description: 'Leave the channel',
  run: async (client, message) => {
    if (!message.guildId) return

    const player = client.lavalink.getPlayer(message.guildId)
    const voiceChannelId = message.member?.voice?.channelId

    if (!voiceChannelId) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('Purple')
            .setDescription('You have to be in a voice channel!')
        ]
      })
    }

    if (!player) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('Purple')
            .setDescription('Bot is not connected!')
        ]
      })
    }

    if (voiceChannelId !== player.voiceChannelId) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('Purple')
            .setDescription('You are in the different voice channel!')
        ]
      })
    }
    await player.destroy('Disconnected')
  }
}
