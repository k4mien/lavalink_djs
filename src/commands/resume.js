const { EmbedBuilder } = require('discord.js')

module.exports = {
  name: 'resume',
  description: 'Resume the player',
  options: [],
  inVoiceChannel: true,
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

    if (!player.queue.current) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('Purple')
            .setDescription('There is nothing in the queue right now!')
        ]
      })
    }

    if (!player.paused) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('Purple')
            .setDescription('The song is not paused!')
        ]
      })
    } else {
      await player.resume()
      await message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('Purple')
            .setDescription(':play_pause: Resumed the song for you!')
        ]
      })
    }
  }
}
