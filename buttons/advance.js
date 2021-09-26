import { getOptions, findClockById, reshowClock } from '../utils.js'

const execute = async (id, state, interaction) => {
  const { guild, uid } = getOptions(['guild', 'uid'], interaction)
  const clock = findClockById(parseInt(id), guild, uid, state)
  if (!clock) await interaction.reply({ content: 'Not sure what went wrong there. Maybe try again?', ephemeral: true })
  clock.curr++
  await reshowClock(interaction, clock)
}

const button = { id: 'advance', execute }
export default button
