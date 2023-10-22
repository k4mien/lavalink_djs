const node = require("./node");
const player = require("./player");

module.exports = async function (client) {
  node(client);
  player(client);
};
