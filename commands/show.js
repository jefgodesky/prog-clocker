import { SlashCommandBuilder } from '@discordjs/builders'
import { getOptions, showClocks } from '../utils.js'

const data = new SlashCommandBuilder()
  .setName('show-clock')
  .setDescription('Show details about one clock in particular')
  .addStringOption(option => option.setName('name')
    .setDescription('The name of the clock you want to see')
    .setRequired(true))

const execute = async function (state, interaction) {
  const { guild, name, uid } = getOptions(['guild', 'name', 'uid'], interaction)
  interaction.reply(showClocks(name, state, { guild, uid }))
}

const command = { data, execute }
export default command
