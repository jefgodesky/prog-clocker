import { getOptions, findClockById } from '../utils.js'

const execute = async (id, state, interaction) => {
  const { guild, uid } = getOptions(['guild', 'uid'], interaction)
  const clock = findClockById(parseInt(id), guild, uid, state)
  if (!clock) await interaction.reply({ content: 'Not sure what went wrong there. Maybe try again?', ephemeral: true })

  let index = -1
  for (let i = 0; i < state.length; i++) {
    if (state[i].id === parseInt(id)) { index = i }
  }
  if (index > -1) state.splice(index, 1)

  await interaction.reply(`Dropped “${clock.name}”`)
}

const button = { id: 'drop', execute }
export default button
