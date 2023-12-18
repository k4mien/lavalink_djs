module.exports = async function (client) {
    client.on("voiceStateUpdate", (oldState, newState) => {
        let oldChannel = oldState?.channel
        let newChannel = newState?.channel

        if (oldChannel?.members.size <= 1 && oldChannel.member.user.bot) {
            const player = client.lavalink.getPlayer(oldState.guild.id)
            setTimeout(() => {
                player?.destroy("QueueEmpty")
            }, 5000)
        }
    });
};
