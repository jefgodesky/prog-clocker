const interactionCreate = {
  name: 'interactionCreate',
  async execute (client, interaction) {
    if (!interaction.isCommand()) return
    const command = client.commands.get(interaction.commandName)
    if (!command) return
    try {
      await command.execute(interaction)
    } catch (err) {
      console.error(err)
      await interaction.reply({ content: 'Sorry, we ran into a problem executing that command.', ephemeral: true })
    }
  }
}

export default interactionCreate
