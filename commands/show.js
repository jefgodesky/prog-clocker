import { SlashCommandBuilder } from '@discordjs/builders'
import { getOptions, findClocks, getClockReply, notFound } from '../utils.js'

const data = new SlashCommandBuilder()
  .setName('show-clock')
  .setDescription('Show details about one clock in particular')
  .addStringOption(option => option.setName('name')
    .setDescription('The name of the clock you want to see')
    .setRequired(true))

const execute = async function (state, interaction) {
  const { guild, name } = getOptions(['guild', 'name'], interaction)
  const clocks = findClocks(guild, name, state)
  const filtered = clocks.filter(clock => !clock.private || clock.private === interaction.user.id)
  if (clocks.length > 0) {
    interaction.reply(getClockReply(filtered))
  } else {
    interaction.reply({ content: notFound(name), ephemeral: true })
  }
}

const command = { data, execute }

export default command
