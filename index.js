import { readdirSync } from 'fs'
import { Client, Collection, Intents } from 'discord.js'
import config from './config/index.js'

const client = new Client({ intents: [Intents.FLAGS.GUILDS] })

client.commands = new Collection()
const commandFiles = readdirSync('./commands').filter(file => file.endsWith('.js'))
for (const file of commandFiles) {
  const command = await import(`./commands/${file}`)
  client.commands.set(command.default.data.name, command.default)
}

client.once('ready', () => {
  console.log('Prog Clocker is ready to clock')
})

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return
  const command = client.commands.get(interaction.commandName)
  if (!command) return
  try {
    await command.execute(interaction)
  } catch (err) {
    console.error(err)
    await interaction.reply({ content: 'Sorry, we ran into a problem executing that command.', ephemeral: true })
  }
})

client.login(config.token)
