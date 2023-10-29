const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "forward",
    aliases: ["f"],
    description: "Forward the current song",
    options: [],
    inVoiceChannel: true,
    run: async (client, message, args) => {
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
                        .setDescription("You are in the different voice channel"),
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

        if(!args[0]){
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Purple")
                        .setDescription("Please provide time in seconds!"),
                ],
            });
        }

        const time = Number(args[0]);

        if (isNaN(time) || time <= 0)
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Blue")
                        .setDescription("Please enter a valid number!"),
                ],
            });

    },
};
