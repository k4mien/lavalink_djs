const node = require("./node");
const player = require("./player");

module.exports = async function (client) {
  await node(client);
  await player(client);
};
