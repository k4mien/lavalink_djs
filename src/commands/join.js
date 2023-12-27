const { EmbedBuilder } = require('discord.js')

module.exports = {
  name: 'join',
  description: 'Connect bot to the channel',
  options: [],
  run: async (client, message) => {
    if (!message.guildId) return

    const player = client.lavalink.getPlayer(message.guildId)
    const voiceChannelId = message.member?.voice?.channelId
    const voiceChannel = message.member?.voice?.channel

    if (!voiceChannelId) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('Purple')
            .setDescription('You have to be in a voice channel!')
        ]
      })
    }

    if (player?.voiceChannelId === voiceChannelId && player?.connected) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('Purple')
            .setDescription("I'm already connected!")
        ]
      })
    }

    if (player?.voiceChannelId !== voiceChannelId && player?.connected) {
      player.options.voiceChannelId = voiceChannelId
      await player.connect()
      return message.channel.send({
        embeds: [
          new EmbedBuilder().setColor('Purple').setDescription(`Joined ${voiceChannel}!`)
        ]
      })
    }

    if (player) {
      player.voiceChannelId = player.voiceChannelId || voiceChannelId
      await player.connect()
      return message.channel.send({
        embeds: [
          new EmbedBuilder().setColor('Purple').setDescription(`Joined ${voiceChannel}!`)
        ]
      })
    } else {
      const newPlayer = await client.lavalink.createPlayer({
        guildId: message.guildId,
        voiceChannelId,
        textChannelId: message.channelId,
        selfDeaf: true,
        selfMute: false,
        volume: client.defaultVolume,
        instaUpdateFiltersFix: true,
        applyVolumeAsFilter: false
      })
      await newPlayer.connect()
      return message.channel.send({
        embeds: [
          new EmbedBuilder().setColor('Purple').setDescription(`Joined ${voiceChannel}!`)
        ]
      })
    }
  }
}
