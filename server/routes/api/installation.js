var router = require('express').Router();
var mongoose = require('mongoose');
const server = require("../../services/server")

router.post('/status/:token', server.updateState);

module.exports = router;
