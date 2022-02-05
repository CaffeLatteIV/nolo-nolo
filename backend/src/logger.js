// Logging with Winston
// import os from 'os'
// import fs from 'fs'
// import path from 'path'
import winston from 'winston'

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
// const logDir = path.resolve(os.homedir(), './logs')

// if (!fs.existsSync(logDir)) {
//   fs.mkdirSync(logDir)
// }

const logger = (label) => createLogger({
  levels: customLevels,
  format: fileCombine,
  defaultMeta: { label },
  transports: [
    new transports.Console({ level: 'info', format: consoleCombine, handleExceptions: true }),
    new winston.transports.File({ filename: './logs/error.log', level: 'error', handleExceptions: true }),
    new winston.transports.File({ filename: './logs/info.log', level: 'info' }),
    new winston.transports.File({ filename: './logs/combined.log' }),
  ],
})

export default logger
