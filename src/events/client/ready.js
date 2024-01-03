const {ActivityType} = require('discord.js')

module.exports = async function (client) {
    client.user.setActivity('!help', {type: ActivityType.Custom})
    await client.lavalink.init({...client.user, shards: 'auto'})
}
