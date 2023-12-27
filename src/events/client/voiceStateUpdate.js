module.exports = async function (client) {
  client.on('voiceStateUpdate', (oldState, newState) => {
    const oldChannel = oldState?.channel
    const newChannel = newState?.channel

    if (oldChannel?.members.size <= 1) {
      const player = client.lavalink.getPlayer(oldState.guild.id)
      player?.destroy('QueueEmpty')
    }
  })
}
