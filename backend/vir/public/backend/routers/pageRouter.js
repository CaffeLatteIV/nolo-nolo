const express = require('express');
const router = express.Router();
const path = require('path');

// router.use('/', express.static(path.join(global.frontendDir, '/frontoffice')));
router.use('/dashboard', express.static(path.join(global.frontendDir, '/dashboard')));
router.use('/dashboard', express.static(path.join(global.frontendDir, '/_nuxt/')));
router.use('/backoffice', express.static(path.join(global.frontendDir, '/backoffice')));
router.use('/assets', express.static(path.join(global.frontendDir, '/assets')));



module.exports = router;
