const router = require('express').Router();
const authService = require('../services/auth-service')

router.use('/api', require('./api'));
router.use('/settings', require('./settings'));

router.post('/login', authService.login);
router.post('/signup', authService.signup);


module.exports = router;
