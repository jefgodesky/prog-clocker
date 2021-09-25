import { SlashCommandBuilder } from '@discordjs/builders'

const data = new SlashCommandBuilder()
  .setName('tock')
  .setDescription('Move a progress clock back')
  .addStringOption(option => option.setName('name')
    .setDescription('The name of the clock you\'d like to move back')
    .setRequired(true))

const execute = async function (state, interaction) {
  console.log(state)
  console.log(interaction)
}

const command = { data, execute }

export default command
