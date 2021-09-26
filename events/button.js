const button = {
  name: 'interactionCreate',
  async execute (client, state, interaction) {
    if (!interaction.isButton()) return
    const parse = interaction.customId.match(/^(.*?)\[(.*?)\]$/)
    if (!parse || parse.length < 3) return
    const button = client.buttons.get(parse[1])
    if (!button) return
    try {
      await button.execute(parse[2], state, interaction)
    } catch (err) {
      console.error(err)
      await interaction.reply({ content: 'Sorry, we ran into a problem executing that command.', ephemeral: true })
    }
  }
}

export default button
