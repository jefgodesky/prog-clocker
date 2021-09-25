import { readdirSync } from 'fs'
import { Client, Collection, Intents } from 'discord.js'
import config from './config/index.js'

const client = new Client({ intents: [Intents.FLAGS.GUILDS] })

client.commands = new Collection()
const commandFiles = readdirSync('./commands').filter(file => file.endsWith('.js'))
for (const file of commandFiles) {
  const cmd = await import(`./commands/${file}`)
  const command = cmd.default
  client.commands.set(command.data.name, command)
}

const eventFiles = readdirSync('./events').filter(file => file.endsWith('.js'))
for (const file of eventFiles) {
  const evt = await import(`./events/${file}`)
  const event = evt.default
  if (event.once) {
    client.once(event.name, (...args) => event.execute(client, ...args))
  } else {
    client.on(event.name, (...args) => event.execute(client, ...args))
  }
}

client.login(config.token)
