var router = require('express').Router();
var mongoose = require('mongoose');
const server = require("../../services/server")

router.post('/status/usage', server.updateUsage);

module.exports = router;
