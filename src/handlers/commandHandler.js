const { MiniMap } = require('lavalink-client')
const fs = require('fs')
const path = require('path')

const handleCommands = (client) => {
  client.commands = new MiniMap()
  client.aliases = new MiniMap()

  const foldersPath = path.join(__dirname, '..', 'commands')
  const commandFiles = fs
    .readdirSync(foldersPath)
    .filter((file) => file.endsWith('.js'))

  for (const file of commandFiles) {
    const filePath = path.join(foldersPath, file)
    const command = require(filePath)
    console.log(`Loading Command: ${file}`)
    client.commands.set(command.name, command)
    if (command.aliases) {
      command.aliases.forEach((alias) =>
        client.aliases.set(alias, command.name)
      )
    }
  }
}

module.exports = handleCommands
