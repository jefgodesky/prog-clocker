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
 * Get the options from an interaction.
 * @param {string[]} opts - An array of the names of the options requested.
 *   This can also include `guild`, which will return the guild ID.
 * @param {object} interaction - The interaction object.
 * @returns {{}} - An object with keys for each option named in `opts`, with
 *   value set to the value of that option taken from the interaction.
 */

const getOptions = (opts, interaction) => {
  const { options } = interaction
  const obj = {}
  for (const opt of opts) {
    if (opt.toLowerCase() === 'guild') {
      obj.guild = interaction.guildId
    } else {
      const raw = options.get(opt)
      obj[opt] = raw?.value
    }
  }
  return obj
}

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
 * Return embeds for one or more clocks.
 * @param {{}|{}[]} clocks - Either an object representing a single clock, or
 *   an array of such objects.
 * @returns {{files: MessageAttachment[], embeds: MessageEmbed[]}} - An object
 *   ready to be sent as a reply with one or more embeds, representing the
 *   clocks provided.
 */

const getClocksEmbed = clocks => {
  if (Array.isArray(clocks)) {
    let embeds = []
    let files = []
    for (const clock of clocks) {
      const c = getClockEmbed(clock)
      embeds = [ ...embeds, ...c.embeds ]
      files = [ ...files, ...c.files ]
    }
    return { embeds, files }
  } else {
    return getClockEmbed(clocks)
  }
}

/**
 * Formulate a reply that shows embeds for one or more clocks.
 * @param {{}|{}[]} clocks - Either an object representing a single clock, or
 *   an array of such objects.
 * @param {boolean} isPrivate - If `true`, the method will provide an ephemeral
 *   reply.
 * @returns {object} - A reply object with embeds for each of the clocks given.
 */

const getClockReply = (clocks, isPrivate) => {
  const { embeds, files } = getClocksEmbed(clocks)
  return isPrivate
    ? { embeds, files, ephemeral: true }
    : { embeds, files }
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
 * @returns {{}[]} - An array of clock object with the name provided.
 */

const findClocks = (guild, name, state) => {
  const guildClocks = getGuildClocks(guild, state)
  return guildClocks.filter(clock => clock.name.toLowerCase() === name.toLowerCase())
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
    const askedForPrivate = tags.map(t => t.toLowerCase()).includes('private')
    const isPrivate = hasTag(clock.tags, 'private')
    const isMine = clock.private === uid
    if ((isPrivate && !askedForPrivate) || (isPrivate && !isMine)) return false
    if (tags.length < 1) return true
    const matches = tags.map(tag => clock.tags?.includes(tag) || false)
    return logic === 'AND'
      ? matches.reduce((acc, curr) => acc && curr, true)
      : matches.reduce((acc, curr) => acc || curr, false)
  })
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
  hasTag,
  getOptions,
  getClockEmbed,
  getClocksEmbed,
  getClockReply,
  getGuildClocks,
  findClocks,
  filterClocks,
  notFound
}
