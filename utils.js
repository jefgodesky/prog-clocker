import { readdirSync, readFileSync, writeFileSync } from 'fs'

/**
 * Run a function (`fn`) on each file in a directory (`dir`) that ends
 * with `.js`.
 * @param {string} dir - The directory from which we'll find each file that
 *   ends with `.js`.
 * @param {function} fn - The function that we'll run on each JS file.
 */

const forEachJSFile = (dir, fn) => {
  const files = readdirSync(dir).filter(file => file.endsWith('.js'))
  for (const file of files) {
    fn(file)
  }
}

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

export {
  forEachJSFile,
  save,
  load,
  loadJSON
}
