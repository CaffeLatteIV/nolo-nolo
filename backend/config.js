/* eslint-disable no-underscore-dangle */
import { dirname } from 'path'
import { fileURLToPath } from 'url'

global.rootDir = dirname(fileURLToPath(import.meta.url))
