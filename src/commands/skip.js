const {EmbedBuilder} = require("discord.js");

module.exports = {
    name: "skip",
    aliases: ["s"],
    description: "Skip the current song",
    options: [],
    inVoiceChannel: true,
    run: async (client, message) => {
        if (!message.guildId) return;

        const voiceChannelId = message.member?.voice?.channelId;
        const player = client.lavalink.getPlayer(message.guildId);

        if (!voiceChannelId) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Purple")
                        .setDescription("You have to be in a voice channel!"),
                ],
            });
        }

        if (!player)
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Purple")
                        .setDescription("Bot is not connected!"),
                ],
            });

        if (player?.voiceChannelId !== voiceChannelId) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Purple")
                        .setDescription("You are in the different voice channel!"),
                ],
            });
        }

        if ((!player.playing && !player.paused) || !player.queue.current)
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Purple")
                        .setDescription("There is nothing in the queue right now!"),
                ],
            });

        if (!player.queue.tracks.length) {
            // await player.play({encodedTrack: null});
            await player.stopPlaying();
        } else {
            await player.skip();
            return message.channel.send({
                embeds: [
                    new EmbedBuilder().setColor("Purple").setDescription(":track_next: Song skipped!"),
                ],
            });
        }
    },
};
