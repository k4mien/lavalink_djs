const {EmbedBuilder} = require("discord.js");

module.exports = {
    name: "help",
    aliases: ["h"],
    options: [],
    description: "Show all available commands",
    run: async (client, message) => {
        return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor("Purple")
                    .setTitle(":page_facing_up: Commands")
                    .setDescription(
                        client.commands
                            .map(
                                (cmd) => (`${cmd.aliases}` !== "undefined") ? `\`!${cmd.name}, !${cmd.aliases}${cmd.options}\`\t - ${cmd.description}` : `\`!${cmd.name}${cmd.options}\`\t - ${cmd.description}`
                            )
                            .join("\n")
                    ),
            ],
        });
    },
};
