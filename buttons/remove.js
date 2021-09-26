import { getOptions, findClockById, reshowClock } from '../utils.js'

const execute = async (id, state, interaction) => {
  const { guild, uid } = getOptions(['guild', 'uid'], interaction)
  const clock = findClockById(parseInt(id), guild, uid, state)
  if (!clock) return interaction.reply({ content: 'Not sure what went wrong there. Maybe try again?', ephemeral: true })
  clock.curr = Math.max(clock.curr - 1, 0)
  await reshowClock(interaction, clock)
}

const button = { id: 'remove', execute }
export default button
