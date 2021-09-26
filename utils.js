import { readdirSync, readFileSync, writeFileSync } from 'fs'
import { MessageAttachment, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js'

/**
 * Return an array of the file names in a directory (`dir`) that end with a
 * particular substring (`ext`). Usually this will be checking for a particular
 * extension that each file has (e.g., all of the JS files in a directory).
 * @param {string} dir - The directory to search.
 * @param {string} ext - The substring that each filename must end with to be
 *   included (e.g., a file extension).
 * @returns {string[]} - An array of the file names in the given directory
 *   (`dir`) which end with the given substring (`ext`).
 */

const getExtFiles = (dir, ext) => readdirSync(dir).filter(file => file.endsWith(ext))

/**
 * Handy wrapper for fs.writeFileSync.
 * @param {string} file - The file to write to.
 * @param {string} data - The string that is to be written to the file.
 * @param {object?} options - Options to pass to fs.writeFileSync.
 */

const save = (file, data, options) => {
  return writeFileSync(file, data, options)
}

/**
 * Handy wrapper for fs.readFileSync.
 * @param {string} file - The file to read.
 * @param {object?} options - Options to pass to fs.readFileSync.
 * @returns {string} - The contents of the file.
 */

const load = (file, options) => {
  return readFileSync(file, options)
}

/**
 * Reads the contents of a JSON file into a JavaScript object.
 * @param {string} file - The file to read.
 * @param {object?} options - Options to pass to fs.readFileSync.
 * @returns {object|null} - The JavaScript object formed by parsing the JSON in
 *   the specified file, or `null` if the file did not provide parsable JSON.
 */

const loadJSON = (file, options) => {
  if (!file.endsWith('.json')) return null
  try {
    const content = load(file, options)
    return JSON.parse(content)
  } catch {
    return null
  }
}

/**
 * Get the options from an interaction.
 * @param {string[]} opts - An array of the names of the options requested.
 *   This can also include `guild`, which will return the guild ID, and `uid`,
 *   which will return the ID of the user who issued the command.
 * @param {object} interaction - The interaction object.
 * @returns {{}} - An object with keys for each option named in `opts`, with
 *   value set to the value of that option taken from the interaction.
 */

const getOptions = (opts, interaction) => {
  const { options } = interaction
  const obj = {}
  for (const opt of opts) {
    switch (opt.toLowerCase()) {
      case 'guild': obj.guild = interaction.guildId; break
      case 'uid': obj.uid = interaction.user.id; break
      default:
        const raw = options.get(opt)
        obj[opt] = raw?.value
        break
    }
  }
  return obj
}

/**
 * Return a standard error message for when a clock cannot be found by name.
 * @param {string} name - The name supplied for the clock that could not
 *   be found.
 * @returns {string} - A standard error message suitable to be displayed when a
 *   clock is requested by name and cannot be found.
 */

const notFound = name => `Sorry, we couldn't find any clock with the name “${name},” but as a bot, I can be persnickety about precise spelling. You could try the \`/list-clocks\` command to get the exact spelling of the clock you’re looking for.`

export {
  getExtFiles,
  save,
  load,
  loadJSON,
  getOptions,
  notFound
}
