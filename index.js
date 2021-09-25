import { Client, Intents } from 'discord.js'
import config from './config/index.js'

const client = new Client({ intents: [Intents.FLAGS.GUILDS] })

client.once('ready', () => {
  console.log('Prog Clocker is ready to clock')
})

client.login(config.token)
