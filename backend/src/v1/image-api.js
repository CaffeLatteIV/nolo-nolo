import path from 'path'
import express from 'express'
import fs from 'fs'

const app = express.Router()
app.get('/:filename', (req, res) => {
  const { filename } = req.params
  const fullfilepath = path.join(global.rootDir, `/images/${filename}`)
  if(fs.existsSync(fullfilepath)){
    return res.sendFile(fullfilepath)

  }else{
    return res.sendFile(path.join(global.rootDir, `/src/images/${filename}`))
  }
})

export default app
