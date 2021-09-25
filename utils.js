import { readdirSync } from 'fs'

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

export {
  forEachJSFile
}
