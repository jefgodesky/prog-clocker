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
      case 'tags': obj.tags = options.getString('tags')?.split(/[,;]/).map(tag => tag.trim())
      default:
        const raw = options.get(opt)
        obj[opt] = raw?.value
        break
    }
  }
  return obj
}

/**
 * Checks if a clock has a given tag.
 * @param {{ tags: string[] }} clock - The clock object to check.
 * @param {string} tag - The tag we're checking for.
 * @returns {boolean} - `true` if the clock has the given tag, or `false` if it
 *   does not.
 */

const hasTag = (clock, tag) => clock.tags?.map(t => t.toLowerCase().trim()).includes(tag.toLowerCase().trim())

/**
 * Tells you if a given user (identified by hens user ID) has permissions to
 * see the given clock.
 * @param {{ private: string }} clock - The clock in question.
 * @param {string} uid - The ID of the user we're checking.
 * @returns {boolean} - `true` if the user identified by the given ID (`uid`)
 *   has permission to see the clock (`clock`), or `false` if hen does not.
 */

const visibleClock = (clock, uid) => !clock.private || clock.private === uid

const showClock = clock => {
  const { id, max, curr, name, desc, tags } = clock
  const c = Math.min(curr, max)
  const file = `${c}${max}.png`
  const thumb = new MessageAttachment(`./clocks/${file}`)
  const color = c >= max ? '#ffd300' : '#9f190b'
  const embed = new MessageEmbed()
    .setColor(color)
    .setTitle(name)
    .setThumbnail(`attachment://${file}`)
    .addField('Progress', `${c}/${max}`)
  if (desc) embed.setDescription(desc)
  if (tags) embed.addField('Tags', tags.join(', '))

  const advance = new MessageButton()
    .setCustomId(`advance[${id}]`)
    .setLabel('Advance')
    .setStyle('PRIMARY')
  const back = new MessageButton()
    .setCustomId(`remove[${id}]`)
    .setLabel('Remove')
    .setStyle('SECONDARY')
  const drop = new MessageButton()
    .setCustomId(`drop[${id}]`)
    .setLabel('Drop')
    .setStyle('DANGER')
  const row = new MessageActionRow().addComponents([advance, back, drop])

  return { embeds: [embed], files: [thumb], components: [row] }
}

const showClocks = (name, state, params) => {
  const { guild, uid, offset = 0 } = params
  const visibleClocks = getVisibleGuildClocks(state, guild, uid)
  const clocks = visibleClocks.filter(clock => clock.name === name)
  if (clocks.length < 1) return { content: notFound(name), ephemeral: true }
  const more = clocks.length > 1
  const clock = more ? clocks[offset % clocks.length] : clocks[0]
  const reply = showClock(clock)

  if (more) {
    const pkg = { name, offset: offset + 1 }
    const next = new MessageButton()
      .setCustomId(`next[${JSON.stringify(pkg)}]`)
      .setLabel('Next')
      .setStyle('SECONDARY')
    reply.components[0].addComponents([next])
  }

  return reply
}

/**
 * Return a subset of the clocks given that have the given guild.
 * @param {{ guild: string}[]} clocks - The initial array of clock objects.
 * @param {string} guild - The guild ID.
 * @returns {{ guild: string }[]} - A subset of the original array of clock
 *   objects (`clocks`) which have a `guild` property set to the given guild
 *   ID (`guild`).
 */

const getGuildClocks = (clocks, guild) => clocks.filter(clock => clock.guild === guild)

/**
 * Returns the subset of the clocks given that the user identified by the given
 * user ID (`uid`) has permission to see.
 * @param {{ private: string }[]} clocks - The initial array of clock objects.
 * @param {string} uid - The ID of the user we're checking.
 * @returns {{ private: string}[]} - A subset of the original array of clock
 *   objects (`clocks`) which are either not private, or if they are private,
 *   belong to the user identified by the given ID (`uid`).
 */

const getVisibleClocks = (clocks, uid) => clocks.filter(clock => !clock.private || clock.private === uid)

/**
 * Returns the subset of the clocks given that belong to the given guild
 * (`guild`) and which the user identified by the given user ID (`uid`) has
 * permission to see. This is a wrapper that runs `getGuildClocks`, and then
 * runs `getVisibleClocks` on the result, to return a subset filtered by both
 * criteria.
 * @param {{ guild: string, private:string}[]} clocks - The initial array of
 *   clock objects.
 * @param {string} guild - The guild ID.
 * @param {string} uid - The ID of the user we're checking.
 * @returns {{ guild:string, private:string }[]} - A subset of the original
 *   array of clock objects (`clocks`) which both belong to the guild with the
 *   given guild ID (`guild`) and which the user identified by the given user
 *   ID (`uid`) has permission to see.
 */

const getVisibleGuildClocks = (clocks, guild, uid) => getVisibleClocks(getGuildClocks(clocks, guild), uid)

/**
 * Find clocks that match the query criteria.
 * @param {{}} query - An object representing the query.
 * @param {string} query.guild - The guild ID.
 * @param {string} query.uid - The ID of the user who's asking.
 * @param {string[]} query.tags - An array of tags to search for.
 * @param {string} [query.logic = 'OR'] - A string that specifies the logic to
 *   apply to the tags. `AND` will only find clocks that have all of the tags
 *   specified by the query, while `OR` will return any clock that has any of
 *   the specified tags (Default: `OR`).
 * @param {{}[]} state - The current state.
 * @returns {{}[]} - An array of clock objects that match the query criteria.
 */

const findClocks = (query, state) => {
  const { guild, uid, tags = [], logic = 'OR' } = query
  const clocks = getVisibleGuildClocks(state, guild, uid)
  if (!Array.isArray(tags) || tags.length < 1) return clocks
  return clocks.filter(clock => {
    const matches = tags.map(tag => hasTag(clock, tag))
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
  getOptions,
  hasTag,
  showClock,
  showClocks,
  findClocks,
  notFound
}
