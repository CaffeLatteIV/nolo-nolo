import path from 'path'
import express from 'express'

const app = express.Router()
app.get('/:filename', (req, res) => {
  const { filename } = req.params
  const dirname = path.resolve()
  const fullfilepath = path.join(dirname, `src/images/${filename}`)
  return res.sendFile(fullfilepath)
})

export default app
