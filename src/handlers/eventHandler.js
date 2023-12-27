const fs = require('fs')
const path = require('path')

const handleEvents = (client) => {
  const foldersPath = path.join(__dirname, '..', 'events')
  const eventFolders = fs.readdirSync(foldersPath)

  for (const folder of eventFolders) {
    const eventsPath = path.join(foldersPath, folder)
    const eventFiles = fs
      .readdirSync(eventsPath)
      .filter((file) => file.endsWith('.js'))

    for (const file of eventFiles) {
      const eventName = file.split('.')[0]
      const filePath = path.join(eventsPath, file)
      const event = require(filePath)
      console.log(`Loading Event ${folder}: ${file}`)
      client.on(eventName, event.bind(null, client))
    }
  }
}

module.exports = handleEvents
