import { Client, Collection, Intents } from 'discord.js'
import { forEachJSFile } from './utils.js'
import config from './config/index.js'

const client = new Client({ intents: [Intents.FLAGS.GUILDS] })

client.commands = new Collection()
forEachJSFile('./commands', async file => {
  const cmd = await import(`./commands/${file}`)
  const command = cmd.default
  client.commands.set(command.data.name, command)
})

forEachJSFile('./events', async file => {
  const evt = await import(`./events/${file}`)
  const event = evt.default
  if (event.once) {
    client.once(event.name, (...args) => event.execute(client, ...args))
  } else {
    client.on(event.name, (...args) => event.execute(client, ...args))
  }
})

client.login(config.token)
