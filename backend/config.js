/* eslint-disable no-underscore-dangle */
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

global.rootDir = dirname(fileURLToPath(import.meta.url))
global.baseURL = 'https://site202120.tw.cs.unibo.it/v1'
global.frontendDir = join(global.rootDir, 'frontend')
