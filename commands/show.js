import { SlashCommandBuilder } from '@discordjs/builders'
import { findClocks, getClockEmbed, notFound } from '../utils.js'

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
  let embeds = []
  let files = []
  let isPrivate = false
  for (const clock of clocks) {
    if (clock.private && clock.private !== interaction.user.id) continue
    if (clock.private) isPrivate = true
    const c = getClockEmbed(clock)
    console.log(c)
    embeds = [...embeds, ...c.embeds]
    files = [...files, ...c.files]
    console.log({ embeds, files })
  }
  if (clocks.length > 0) {
    const reply = { embeds, files }
    if (isPrivate) reply.ephemeral = true
    console.log(reply)
    interaction.reply(reply)
  } else {
    interaction.reply({ content: notFound(name), ephemeral: true })
  }
}

const command = { data, execute }

export default command
