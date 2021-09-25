import { SlashCommandBuilder } from '@discordjs/builders'
import { findClock, getClockEmbed } from '../utils.js'

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
  if (!clock) {
    interaction.reply({
      content: `Sorry, we couldn't find any clock with the name “${name},” but as a bot, I can be persnickety about precise spelling. You could try the \`/list-clocks\` command to get the exact spelling of the clock you’re looking for.`,
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
