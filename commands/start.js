import { SlashCommandBuilder } from '@discordjs/builders'
import { getOptions, hasTag, showClock } from '../utils.js'

const data = new SlashCommandBuilder()
  .setName('start-clock')
  .setDescription('Start a new progress clock')
  .addStringOption(option => option.setName('name')
    .setDescription('What do you want to call this clock?')
    .setRequired(true))
  .addIntegerOption(option => option.setName('length')
    .setDescription('How many segments will this clock have?')
    .setRequired(true)
    .addChoice('4', 4)
    .addChoice('6', 6)
    .addChoice('8', 8))
  .addStringOption(option => option.setName('desc')
    .setDescription('Anything else about this clock we should know?')
    .setRequired(false))
  .addStringOption(option => option.setName('tags')
    .setDescription('Comma- or semicolon-separated list of tags')
    .setRequired(false))

const execute = async function (state, interaction) {
  const opts = ['guild', 'name', 'length', 'desc', 'tags']
  const { guild, name, length, desc, tags } = getOptions(opts, interaction)
  const id = state.length === 0 ? 0 : Math.max(...state.map(state => state.id)) + 1
  const clock = { id, guild, name, max: length, curr: 0, desc, tags }
  const isPrivate = hasTag(clock, 'Private')
  if (isPrivate) clock.private = interaction.user.id
  state.push(clock)
  interaction.reply(showClock(clock))
}

const command = { data, execute }
export default command
