const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "join",
  description: "Connect bot to the channel",
  options: [],
  run: async (client, message) => {
    if (!message.guildId) return;

    const voiceChannelId = message.member?.voice?.channelId;

    if (!voiceChannelId) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Purple")
            .setDescription("You have to be in a voice channel!"),
        ],
      });
    }

    const player = client.lavalink.getPlayer(message.guildId);

    if (player?.voiceChannelId != voiceChannelId && player?.connected) {
      const newPlayer = client.lavalink.updatePlayer();
      // player.voiceChannelId = voiceChannelId;
      await newPlayer.connect();
      return message.channel.send({
        embeds: [
          new EmbedBuilder().setColor("Purple").setDescription("Joined!"),
        ],
      });
    }

    if (player?.voiceChannelId == voiceChannelId && player?.connected) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Purple")
            .setDescription("I'm already connected!"),
        ],
      });
    }

    if (player) {
      player.voiceChannelId = voiceChannelId;
      await player.connect();
      return message.channel.send({
        embeds: [
          new EmbedBuilder().setColor("Purple").setDescription("Joinedd!"),
        ],
      });
    } else {
      const newPlayer = await client.lavalink.createPlayer({
        guildId: message.guildId,
        voiceChannelId: voiceChannelId,
        textChannelId: message.channelId,
        selfDeaf: true,
        selfMute: false,
        volume: client.defaultVolume, // default volume
        instaUpdateFiltersFix: true, // optional
        applyVolumeAsFilter: false, // if true player.setVolume(54) -> player.filters.setVolume(0.54)
        // node: "YOUR_NODE_ID",
        // vcRegion: (interaction.member as GuildMember)?.voice.channel?.rtcRegion!
      });
      await newPlayer.connect();
      return message.channel.send({
        embeds: [
          new EmbedBuilder().setColor("Purple").setDescription("Joined!"),
        ],
      });
    }
  },
};
