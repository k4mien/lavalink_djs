let foo

module.exports = async function (client) {
  client.on('voiceStateUpdate', (oldState) => {
    const oldChannel = oldState?.channel

    if (foo) {
      clearTimeout(foo)
      foo = null
    }

    if (oldChannel?.members.size === 1) {
      if (oldChannel?.members.find(member => member.user.bot === true) !== undefined) {
        foo = setTimeout(() => {
          const player = client.lavalink.getPlayer(oldState.guild.id)
          player?.destroy('QueueEmpty')
        }, 60000)
      }
    }
  })
}
