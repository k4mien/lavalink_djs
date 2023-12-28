module.exports = async function (client) {
  client.on('voiceStateUpdate', (oldState) => {
    const oldChannel = oldState?.channel

    if (oldChannel?.members.size <= 1) {
      const player = client.lavalink.getPlayer(oldState.guild.id)
      player?.destroy('QueueEmpty')
    }
  })
}
