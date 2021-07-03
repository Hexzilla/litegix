const { body } = require('express-validator')
const router = require("express").Router()
const auth = require("../auth")
const service = require("../../services/service")

router.post("/",
  auth.required,
  body('serverId').isString(),
  service.getSystemServices)

module.exports = router
