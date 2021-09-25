import { SlashCommandBuilder } from '@discordjs/builders'

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
  console.log(state)
  console.log(interaction)
}

const command = { data, execute }

export default command
