const { body } = require('express-validator')
const router = require("express").Router()
const auth = require("../auth")
const application = require("../../services/application-service")

router.post("/",
  auth.required,
  body('serverId').isString(),
  application.getSystemServices)

module.exports = router
