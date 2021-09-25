import { SlashCommandBuilder } from '@discordjs/builders'
import { findClock, getClockEmbed, notFound } from '../utils.js'

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
  const clock = findClock(guild, name, state)
  if (!clock || clock.private !== interaction.user.id) {
    interaction.reply({
      content: notFound(name),
      ephemeral: true
    })
  } else {
    const reply = clock.private
      ? Object.assign({}, getClockEmbed(clock), { ephemeral: true })
      : getClockEmbed(clock)
    interaction.reply(reply)
  }
}

const command = { data, execute }

export default command
