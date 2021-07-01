const { body } = require('express-validator')
const router = require("express").Router()
const auth = require("../auth")
const server = require("../../services/server-service")

router.get("/", auth.required, server.getServers)

router.post("/create", 
  auth.required, 
  body('name').notEmpty(),
  body('address').isIP(4),
  body('provider').notEmpty(),
  body('web_server').notEmpty(),
  body('database').notEmpty(),
  body('phpVersion').notEmpty(),
  server.createServer)

router.post("/summary",
  auth.required,
  server.summary);

router.post("/delete",
  auth.required,
  server.deleteServer);

module.exports = router
