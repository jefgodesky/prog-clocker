import { SlashCommandBuilder } from '@discordjs/builders'
import { findClocks, getClocksEmbed, notFound } from '../utils.js'

const data = new SlashCommandBuilder()
  .setName('show-clock')
  .setDescription('Show details about one clock in particular')
  .addStringOption(option => option.setName('name')
    .setDescription('The name of the clock you want to see')
    .setRequired(true))

const execute = async function (state, interaction) {
  const { options } = interaction
  const guild = interaction.guildId
  const name = options.getString('name')
  const clocks = findClocks(guild, name, state)
  const filtered = clocks.filter(clock => !clock.private || clock.private === interaction.user.id)
  const isPrivate = filtered.filter(clock => clock.private).length > 0
  if (clocks.length > 0) {
    const reply = getClocksEmbed(filtered)
    if (isPrivate) reply.ephemeral = true
    interaction.reply(reply)
  } else {
    interaction.reply({ content: notFound(name), ephemeral: true })
  }
}

const command = { data, execute }

export default command
