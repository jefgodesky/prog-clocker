import { SlashCommandBuilder } from '@discordjs/builders'
import { MessageEmbed } from 'discord.js'
import { getOptions, findClocks } from '../utils.js'

const data = new SlashCommandBuilder()
  .setName('list-clocks')
  .setDescription('Show the clocks currently ticking')
  .addStringOption(option => option.setName('tags')
    .setDescription('Tags of the clocks you\'d like to list')
    .setRequired(false))
  .addStringOption(option => option.setName('logic')
    .setDescription('Show clocks that have all of those tags or any of them?')
    .addChoice('All', 'AND')
    .addChoice('Any', 'OR'))

const execute = async function (state, interaction) {
  const opts = ['guild', 'uid', 'tags', 'logic']
  const { guild, uid, tags, logic } = getOptions(opts, interaction)
  const query = { guild, tags, logic: logic || 'OR', uid }
  const clocks = findClocks(query, state)
  const expr = clocks.map(clock => {
    const { name, curr, max} = clock
    return `${name} (${curr}/${max})`
  })
  const embed = new MessageEmbed()
    .setColor('#9f190b')
    .setTitle('Ticking Clocks')
    .setDescription(expr.join('\n'))
  const ephemeral = clocks.filter(clock => clock.private).length > 0
  interaction.reply({ embeds: [embed], ephemeral })
}

const command = { data, execute }
export default command
