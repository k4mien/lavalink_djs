const { EmbedBuilder } = require('discord.js')
const formatMSHHMMSS = require('../utils/time')

module.exports = {
  name: 'forward',
  aliases: ['f'],
  description: 'Forward the current song',
  options: [],
  inVoiceChannel: true,
  run: async (client, message, args) => {
    if (!message.guildId) return

    const voiceChannelId = message.member?.voice?.channelId
    const player = client.lavalink.getPlayer(message.guildId)

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

    if (player?.voiceChannelId !== voiceChannelId) {
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

    if (player.paused) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('Purple')
            .setDescription('The current song is paused! Resume to forward it!')
        ]
      })
    }

    if (!args[0]) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('Purple')
            .setDescription('Please provide time in seconds!')
        ]
      })
    }

    const time = Number(args[0]) * 1000

    if (isNaN(time)) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('Purple')
            .setDescription('Please enter a valid number!')
        ]
      })
    }

    if (time > player.queue.current.info.duration || time < 0) {
      return await message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('Purple')
            .setDescription('The position cannot be bigger than song duration or negative')
        ]
      })
    }

    await player.seek(time)
    await message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor('Purple')
          .setDescription(`:fast_forward: Forwarded the song to: \`[${formatMSHHMMSS(time)} / ${formatMSHHMMSS(player.queue.current.info.duration)}]\``)
      ]
    })
  }
}
