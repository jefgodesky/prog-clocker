import { SlashCommandBuilder } from '@discordjs/builders'

const data = new SlashCommandBuilder()
  .setName('tick')
  .setDescription('Advance a progress clock')
  .addStringOption(option => option.setName('name')
    .setDescription('The name of the clock you\'d like to advance')
    .setRequired(true))

const execute = async function (interaction) {
  console.log(interaction)
}

const command = { data, execute }

export default command
