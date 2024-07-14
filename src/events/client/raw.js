module.exports = async function (client, data) {
  await client.lavalink.sendRawData(data);
};
