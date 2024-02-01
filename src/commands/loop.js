const { EmbedBuilder } = require('discord.js')

module.exports = {
  name: 'loop',
  aliases: ['l'],
  description: 'Loop the current song or queue',
  options: [' <off | track | queue>'],
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

    if (!args[0]) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('Purple')
            .setDescription(`The repeat mode is set to: \`${player.repeatMode}\``)
        ]
      })
    }

    switch (args[0]) {
      case 'off':
        await player.setRepeatMode(args[0])
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor('Purple')
              .setDescription(':twisted_rightwards_arrows: Repeat mode disabled!')
          ]
        })
      case 'track':
        await player.setRepeatMode(args[0])
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor('Purple')
              .setDescription(':repeat: Repeat mode `track` enabled!')
          ]
        })
      case 'queue':
        await player.setRepeatMode(args[0])
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor('Purple')
              .setDescription(':repeat_one: Repeat mode `queue` enabled!')
          ]
        })
      default:
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor('Purple')
              .setDescription('Please enter correct repeat mode: `off`, `track`, `queue`')
          ]
        })
    }
  }
}
