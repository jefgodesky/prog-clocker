import { Client, Collection, Intents } from 'discord.js'
import { getExtFiles, save, loadJSON } from './utils.js'
import config from './config/index.js'

const state = loadJSON('./state.json') || []
const client = new Client({ intents: [Intents.FLAGS.GUILDS] })

client.commands = new Collection()
const commandFiles = getExtFiles('./commands', '.js')
for (const file of commandFiles) {
  const cmd = await import(`./commands/${file}`)
  const command = cmd.default
  client.commands.set(command.data.name, command)
}

const eventFiles = getExtFiles('./events', '.js')
for (const file of eventFiles) {
  const evt = await import(`./events/${file}`)
  const event = evt.default
  if (event.once) {
    client.once(event.name, (...args) => event.execute(client, state, ...args))
  } else {
    client.on(event.name, (...args) => event.execute(client, state, ...args))
  }
}

process.on('SIGINT', async () => {
  await save('./state.json', JSON.stringify(state))
  process.exit()
})

client.login(config.token)
