import { SlashCommandBuilder } from '@discordjs/builders'

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
  console.log(state)
  console.log(interaction)
}

const command = { data, execute }

export default command
