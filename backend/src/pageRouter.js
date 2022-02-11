import express from 'express'
import path from 'path'

const router = express.Router()
// router.use('/', express.static(path.join(global.frontendDir, '/frontoffice')));
router.use(express.static(path.join(global.frontendDir, 'dashboard')))
router.use(express.static(path.join(global.frontendDir, 'frontoffice')))
router.use(express.static(path.join(global.frontendDir, 'backoffice')))
router.use('/admin/*', (req, res) => res.sendFile(path.join(global.frontendDir, 'backoffice', 'app.html')))
router.use('/dashboard/oggetti', (req, res) => res.sendFile(path.join(global.frontendDir, 'dashboard', 'HTML', 'index.html')))
router.use('/dashboard/clienti', (req, res) => res.sendFile(path.join(global.frontendDir, 'dashboard', 'HTML', 'clientStats.html')))
router.use('/dashboard/item', (req, res) => res.sendFile(path.join(global.frontendDir, 'dashboard', 'HTML', 'itemStats.html')))
router.use('/*', (req, res) => res.sendFile(path.join(global.frontendDir, 'frontoffice', 'index.html')))

export default router
