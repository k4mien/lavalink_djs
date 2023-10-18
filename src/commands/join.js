const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "join",
  description: "Connect bot to the channel",
  options: [],
  run: async (client, message) => {
    if (!message.guildId) return;

    const voiceChannelId = message.member.voice.channelId;
    const voiceChannel = message.member.voice.channel;
    const botMember = message.guild.members.cache.get(message.client.user.id);

    if (!voiceChannelId) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Blue")
            .setDescription("You have to be in a voice channel!"),
        ],
      });
    }
    if (!voiceChannel.joinable || !voiceChannel.speakable) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Blue")
            .setDescription("I cannot join this channel!"),
        ],
      });
    }

    const player = client.lavalink.getPlayer(message.guildId);
    if (player?.voiceChannelId && player.connected) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Blue")
            .setDescription("I'm already connected!"),
        ],
      });
    } else {
      console.log("test1111");
    }

    if (player) {
      player.voiceChannelId = player.voiceChannelId || voiceChannelId;
      await player.connect();
    }

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
      embeds: [new EmbedBuilder().setColor("Blue").setDescription("Joined!")],
    });

    //  else if (!botMember.voice?.channelId) {
    //   await client.distube.voices.join(voiceChannel);
    //   return message.channel.send({
    //     embeds: [new EmbedBuilder().setColor("Blue").setDescription("Joined!")],
    //   });
    // }
    //  else if (botMember.voice?.channelId) {
    //   const botVoiceChannelId = botMember.voice.channelId;
    //   if (voiceChannel?.id != botVoiceChannelId) {
    //     await client.distube.voices.join(voiceChannel);
    //     return message.channel.send({
    //       embeds: [
    //         new EmbedBuilder().setColor("Blue").setDescription("Joined!"),
    //       ],
    //     });
    //   }
    //    else {
    //     return message.channel.send({
    //       embeds: [
    //         new EmbedBuilder()
    //           .setColor("Blue")
    //           .setDescription("I'm already in this channel"),
    //       ],
    //     });
    // }
    // }
  },
};
