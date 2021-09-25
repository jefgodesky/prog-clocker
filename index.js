import { Client, Collection, Intents } from 'discord.js'
import { forEachJSFile, save, loadJSON } from './utils.js'
import config from './config/index.js'

const state = loadJSON('./state.json') || {}
console.log(state)
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
    client.once(event.name, (...args) => event.execute(client, state, ...args))
  } else {
    client.on(event.name, (...args) => event.execute(client, state, ...args))
  }
})

process.on('SIGINT', async () => {
  await save('./state.json', JSON.stringify(state))
  process.exit()
})

client.login(config.token)
