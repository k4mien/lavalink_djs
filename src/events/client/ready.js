const { ActivityType } = require("discord.js");

module.exports = async function (client) {
  client.user.setActivity("d-_-b", { type: ActivityType.Custom });
  await client.lavalink.init({ ...client.user, shards: "auto" });
};
