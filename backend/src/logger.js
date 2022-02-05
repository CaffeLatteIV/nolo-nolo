// Logging with Winston
import fs from 'fs'
import path from 'path'
import winston from 'winston'
import { fileURLToPath } from 'url'
const { createLogger, format, transports } = winston
const { combine, timestamp, printf, colorize, prettyPrint } = format

const customFormat = printf((info) => `${info.timestamp} [${info.label}]${info.level}: ${info.message}`)
const consoleCombine = combine(
  prettyPrint(),
  timestamp(),
  colorize(),
  customFormat,
)
const fileCombine = combine(
  prettyPrint(),
  timestamp(),
  customFormat,
)
const customLevels = {
  error: 0,
  warn: 1,
  data: 2,
  info: 3,
  debug: 4,

}
if (!global.rootDir) {
  global.rootDir = path.dirname(fileURLToPath(import.meta.url))
}
const logDir = path.join(global.rootDir, '/logs')

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir)
}

const logger = (label) => createLogger({
  levels: customLevels,
  format: fileCombine,
  defaultMeta: { label },
  transports: [
    new transports.Console({ level: 'info', format: consoleCombine, handleExceptions: true }),
    new winston.transports.File({ filename: 'error.log', level: 'error', handleExceptions: true }),
    new winston.transports.File({ filename: 'info.log', level: 'info' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
})

export default logger
