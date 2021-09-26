import { getOptions, showClocks } from '../utils.js'

const execute = async (params, state, interaction) => {
  const { guild, uid } = getOptions(['guild', 'uid'], interaction)
  const args = JSON.parse(params)
  const msg = await interaction.channel.messages.fetch(interaction.message.id)
  await msg.delete()
  await interaction.reply(showClocks(args.name, state, { guild, uid, offset: args.offset }))
}

const button = { id: 'next', execute }
export default button
