import Express from 'express'

const api = Express.Router()

api.get('/', (req, res) => res.send('wooo'))
export default api
