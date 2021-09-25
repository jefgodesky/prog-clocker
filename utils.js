import { readdirSync, readFileSync, writeFileSync } from 'fs'
import { MessageAttachment, MessageEmbed } from 'discord.js'

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
 * Tests if an array of tags includes a particular tag. This is a
 * case-insensitive search.
 * @param {string[]} tags - An array of tags to search.
 * @param {string} query - A tag to search for in the array.
 * @returns {boolean} - `true` if `query` is a tag in the array of `tags`
 *   (regardless of case), or `false` if it is not.
 */

const hasTag = (tags, query) => tags?.map(tag => tag.toLowerCase()).includes(query.toLowerCase()) || false

/**
 * Returns an embed to display the current state of a progress clock.
 * @param {{ name: string, max: number, curr: number, desc: string,
 *   tags: string[]}} clock - An object representing a progress clock.
 * @returns {object} - An object ready to be sent to the channel to display
 *   an embed reflecting the current state of the clock.
 */

const getClockEmbed = clock => {
  const { max, curr, name, desc, tags } = clock
  const file = `${curr}${max}.png`
  const thumb = new MessageAttachment(`./clocks/${file}`)
  const embed = new MessageEmbed()
    .setColor('#9f190b')
    .setTitle(name)
    .setThumbnail(`attachment://${file}`)
    .addField('Progress', `${curr}/${max}`)
  if (desc) embed.setDescription(desc)
  if (tags) embed.addField('Tags', tags.join(', '))
  return { embeds: [embed], files: [thumb] }
}

/**
 * Return only those clocks that were made for the specified guild.
 * @param {string} guild - The guild ID.
 * @param {{}[]} state - The current state.
 * @returns {{}|null} - An array of clock objects, containing only those clocks
 *   for which the `guild` property equals the given guild ID.
 */

const getGuildClocks = (guild, state) => state.filter(clock => clock.guild === guild)

/**
 * Return the first clock in the state that has the guild ID and the name
 * requested.
 * @param {string} guild - The guild ID.
 * @param {string} name - The name of the clock to find.
 * @param {{}[]} state - The current state.
 * @returns {{}|null} - The clock object requested, or `null` if it could not
 *   be found.
 */

const findClock = (guild, name, state) => {
  const guildClocks = getGuildClocks(guild, state)
  const matches = guildClocks.filter(clock => clock.name.toLowerCase() === name.toLowerCase())
  return matches.length > 0 ? matches[0] : null
}

/**
 * Filter clocks by the logic presented in the `query`.
 * @param {object} query - An object representing the query to be used.
 * @param {string} query.guild - The guild ID.
 * @param {string[]?} query.tags - The tags to filter by.
 * @param {string?} [query.logic = 'OR'] - The logic to use when filtering by
 *   tags. If set to `AND`, a clock must have all of the tags supplied by
 *   `query.tags` in order to be included. If set to `OR~ (or any other value),
 *   then a clock will be included if it has any of the tags supplied by
 *   `query.tags`. In either case, though, private clocks are only shown to the
 *   person who created them. (Default: `OR`).
 * @param {string} uid - The user ID of the person asking for the list.
 * @param {{}[]} state - The current state.
 * @returns {{}[]} - An array of clock objects that meet the criteria laid out
 *   in the query.
 */

const filterClocks = (query, state) => {
  const { guild, tags = [], logic = 'OR', uid } = query
  const guildClocks = getGuildClocks(guild, state)
  return guildClocks.filter(clock => {
    if (hasTag(clock.tags, 'private') && clock.private !== uid) return false
    if (tags.length < 1) return true
    const matches = tags.map(tag => clock.tags?.includes(tag) || false)
    return logic === 'AND'
      ? matches.reduce((acc, curr) => acc && curr, true)
      : matches.reduce((acc, curr) => acc || curr, false)
  })
}

export {
  getExtFiles,
  save,
  load,
  loadJSON,
  hasTag,
  getClockEmbed,
  getGuildClocks,
  findClock,
  filterClocks
}
