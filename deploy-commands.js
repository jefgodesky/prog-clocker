import { readdirSync } from 'fs'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import config from './config/index.js'
const { clientId, guildId, token } = config

const commands = []
const commandFiles = readdirSync('./commands').filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
  const command = await import(`./commands/${file}`)
  commands.push(command.default.data.toJSON())
}

const rest = new REST({ version: '9' }).setToken(token)

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
  .then(() => { console.log('Prog Clocker has successfully registered its commands.') })
  .catch(err => console.error(err))
