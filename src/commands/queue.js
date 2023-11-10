const {EmbedBuilder} = require("discord.js");
const {
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    ComponentType,
} = require("discord.js");
const formatMS_HHMMSS = require("../utils/time")

module.exports = {
    name: "queue",
    aliases: ["q"],
    description: "Show all songs in the queue",
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

        let currentPage = 0;

        const embeds = embedGenerator(player);

        const previousButton = new ButtonBuilder()
            .setLabel("Previous")
            .setStyle(ButtonStyle.Primary)
            .setCustomId("previous-button")
            .setDisabled(currentPage === 0);

        const nextButton = new ButtonBuilder()
            .setLabel("Next")
            .setStyle(ButtonStyle.Primary)
            .setCustomId("next-button")
            .setDisabled(currentPage === 0 && embeds.length === 1);

        const buttonRow = new ActionRowBuilder().addComponents(
            previousButton,
            nextButton
        );

        const queueEmbed = await message.channel.send({
            embeds: [embeds[currentPage].setFooter({text: `Page: ${currentPage + 1}/${embeds.length}`})],
            components: [buttonRow],
        });

        const filter = (i) => i.user.id === message.author.id;

        const collector = queueEmbed.createMessageComponentCollector({
            componentType: ComponentType.Button,
            filter,
            time: 30000,
        });

        collector.on("collect", (interaction) => {
            if (interaction.customId === "next-button") {
                if (currentPage < embeds.length - 1) {
                    currentPage += 1;
                    if (currentPage === embeds.length - 1) {
                        nextButton.setDisabled(true);
                        previousButton.setDisabled(false)
                        interaction.update({
                            embeds: [embeds[currentPage].setFooter({text: `Page: ${currentPage + 1}/${embeds.length}`})],
                            components: [buttonRow],
                        });
                    } else {
                        nextButton.setDisabled(false)
                        previousButton.setDisabled(false);
                        interaction.update({
                            embeds: [embeds[currentPage].setFooter({text: `Page: ${currentPage + 1}/${embeds.length}`})],
                            components: [buttonRow],
                        });
                    }
                }
            } else if (interaction.customId === "previous-button") {
                if (currentPage !== 0) {
                    currentPage -= 1;
                    if (currentPage === 0) {
                        nextButton.setDisabled(false)
                        previousButton.setDisabled(true);
                        interaction.update({
                            embeds: [embeds[currentPage].setFooter({text: `Page: ${currentPage + 1}/${embeds.length}`})],
                            components: [buttonRow],
                        });
                    } else {
                        nextButton.setDisabled(false);
                        interaction.update({
                            embeds: [embeds[currentPage].setFooter({text: `Page: ${currentPage + 1}/${embeds.length}`})],
                            components: [buttonRow],
                        });
                    }
                }
            }
        });

        collector.on("end", () => {
            previousButton.setDisabled(true);
            nextButton.setDisabled(true);

            queueEmbed.edit({
                components: [buttonRow],
            });
        });

    },
};

function embedGenerator(player) {
    const embeds = [];
    let songs = 15;
    for (let i = 0; i <= player.queue.tracks.length; i += 15) {
        const current = player.queue.tracks.slice(i, songs);
        songs += 15;
        let j = i;
        const info = current
            .map(
                (v) =>
                    v.info.sourceName === "youtube" ? `${++j}.[ ${v.info.title}](${v.info.uri}) - \`[${
                            formatMS_HHMMSS(v.info.duration)
                        }]\``
                        : `${++j}.[ ${v.info.author} - ${v.info.title}](${v.info.uri}) - \`[${
                            formatMS_HHMMSS(v.info.duration)
                        }]\``
            )
            .join("\n");
        const msg = new EmbedBuilder()
            .setTitle("🎵 Queue\n\n")
            .setColor("Purple")
            .setDescription(
                player.queue.current.info.sourceName === "youtube"
                    ? `**Now Playing:** [${player.queue.current.info.title}](${player.queue.current.info.uri}) - \`[${formatMS_HHMMSS(player
                        .queue.current.info.duration)}]\`\n\n${info}`
                    : `**Now Playing:** [${player.queue.current.info.author} - ${player.queue.current.info.title}](${player.queue.current.info.uri}) - \`[${formatMS_HHMMSS(player
                        .queue.current.info.duration)}]\`\n\n${info}`
            )
        embeds.push(msg);
    }
    return embeds;
}