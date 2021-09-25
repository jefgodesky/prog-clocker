import { SlashCommandBuilder } from '@discordjs/builders'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import config from './config/index.js'
const { clientId, guildId, token } = config

const commands = [
  new SlashCommandBuilder()
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
      .setRequired(false)),
  new SlashCommandBuilder()
    .setName('tick')
    .setDescription('Advance a progress clock')
    .addStringOption(option => option.setName('name')
      .setDescription('The name of the clock you\'d like to advance')
      .setRequired(true)),
  new SlashCommandBuilder()
    .setName('tock')
    .setDescription('Move a progress clock back')
    .addStringOption(option => option.setName('name')
      .setDescription('The name of the clock you\'d like to move back')
      .setRequired(true)),
  new SlashCommandBuilder()
    .setName('stop-clock')
    .setDescription('Abandon a progress clock')
    .addStringOption(option => option.setName('name')
      .setDescription('The name of the clock you\'d like to abandon')
      .setRequired(true)),
  new SlashCommandBuilder()
    .setName('list-clocks')
    .setDescription('Show the clocks currently ticking')
    .addStringOption(option => option.setName('tags')
      .setDescription('Tags of the clocks you\'d like to list')
      .setRequired(false))
    .addStringOption(option => option.setName('logic')
      .setDescription('Show clocks that have all of those tags or any of them?')
      .addChoice('All', 'AND')
      .addChoice('Any', 'OR'))
]

const rest = new REST({ version: '9' }).setToken(token)
const body = commands.map(command => command.toJSON())

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body })
  .then(() => { console.log('Prog Clocker has successfully registered its commands.') })
  .catch(err => console.error(err))
