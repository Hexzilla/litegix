const { body } = require('express-validator')
const router = require("express").Router()
const auth = require("../auth")
const server = require("../../services/server-service")

router.get("/",
  auth.required,
  body('serverId').isString(),
  server.getServers)

module.exports = router
