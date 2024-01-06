const { EmbedBuilder } = require('discord.js')

module.exports = {
  name: 'play',
  aliases: ['p'],
  options: [' <url | text>'],
  description: 'Play a song or playlist',
  inVoiceChannel: true,
  run: async (client, message, args) => {
    if (!message.guildId) return

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

    const query = args.join(' ')

    if (!query) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('Purple')
            .setDescription('Please enter a song url or query to search!')
        ]
      })
    }

    const player =
            client.lavalink.getPlayer(message.guildId) ||
            (await client.lavalink.createPlayer({
              guildId: message.guildId,
              voiceChannelId,
              textChannelId: message.channelId,
              selfDeaf: true,
              selfMute: false,
              volume: client.defaultVolume, // default volume
              instaUpdateFiltersFix: true, // optional
              applyVolumeAsFilter: false // if true player.setVolume(54) -> player.filters.setVolume(0.54)
              // node: "YOUR_NODE_ID",
              // vcRegion: (interaction.member as GuildMember)?.voice.channel?.rtcRegion!
            }))

    if (!player.connected) await player.connect()

    if (player?.voiceChannelId !== voiceChannelId) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('Purple')
            .setDescription('You are in the different voice channel!')
        ]
      })
    }

    const response = await player.search({ query }, message.user)

    if (!response || !response.tracks?.length) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor('Purple')
            .setDescription('The result not found!')
        ]
      })
    }

    const source = response.tracks[0].info.sourceName
    let color = 'Purple'
    let icon = ''

    await player.queue.add(
      response.loadType === 'playlist' ? response.tracks : response.tracks[0]
    )

    switch (source) {
      case 'youtube':
        color = '#FF0000'
        icon = 'https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/395_Youtube_logo-256.png'
        break
      case 'spotify':
        color = '#1DB954'
        icon = 'https://cdn3.iconfinder.com/data/icons/social-media-pack-12/512/Spotify-128.png'
        break
      case 'soundcloud':
        color = '#ff5500'
        icon = 'https://cdn1.iconfinder.com/data/icons/social-icon-1-1/512/social_style_1_soundCloud-512.png'
        break
      case 'twitch':
        color = '#6441a5'
        icon = 'https://cdn2.iconfinder.com/data/icons/social-micon/512/twitch-256.png'
        break
    }

    await message.channel.send({
      embeds: [
        new EmbedBuilder().setColor(color).setDescription(
          response.loadType === 'playlist'
            ? response.playlist.sourceName === 'youtube'
              ? `Added [**${response.playlist.title}**](${response.playlist.uri ? response.playlist.uri : args[0]}) **(${response.tracks.length} tracks)** to the queue`
              : `Added [**${response.playlist.author} - ${response.playlist.title}**](${response.playlist.uri ? response.playlist.uri : args[0]}) **(${response.tracks.length} tracks)** to the queue`
            : response.tracks[0].info.sourceName === 'youtube'
              ? `Added [**${response.tracks[0].info.title}**](${response.tracks[0].info.uri}) to the queue`
              : `Added [**${response.tracks[0].info.author} - ${response.tracks[0].info.title}**](${response.tracks[0].info.uri}) to the queue`
        ).setFooter({
          text: source.charAt(0).toUpperCase() + source.slice(1),
          iconURL: icon
        }).setTimestamp()
      ]
    })

    if (!player.playing) await player.play()
  }
}
