import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const env = process.env.NODE_ENV || 'development'
const config = require(`./${env}.json`)
export default config
