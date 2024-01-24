const { EmbedBuilder } = require('discord.js')

module.exports = {
  name: 'pause',
  description: 'Pause the player',
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

    if ((!player.playing && !player.paused) || !player.queue.current) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('Purple')
            .setDescription('There is nothing in the queue right now!')
        ]
      })
    }

    if (player.paused) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('Purple')
            .setDescription('The song is already paused!')
        ]
      })
    } else {
      await player.pause()
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('Purple')
            .setDescription(':pause_button: Paused the song for you!')
        ]
      })
    }
  }
}
