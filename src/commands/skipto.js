const { EmbedBuilder } = require('discord.js')

module.exports = {
  name: 'skipto',
  aliases: ['st'],
  description: 'Skip to provided song',
  options: [' <number>'],
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

    if ((!player.playing && !player.paused) || !player.queue.current) {
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
            .setDescription('Please enter a song position!')
        ]
      })
    }

    const position = Number(args[0])

    if (isNaN(position)) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('Purple')
            .setDescription('Please enter a valid number!')
        ]
      })
    }

    if (!(position > 0 && position <= player.queue.tracks.length)) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('Purple')
            .setDescription('There is no song at this position!')
        ]
      })
    }

    if (!player.queue.tracks.length) {
      // await player.play({encodedTrack: null});
      await player.stopPlaying()
    } else {
      await message.channel.send({
        embeds: [
          new EmbedBuilder().setColor('Purple').setDescription(`:track_next: Song skipped to \`[#${position}]\` position!`)
        ]
      })
      await player.skip(position)
    }
  }
}
