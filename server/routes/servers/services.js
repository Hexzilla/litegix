const { body } = require('express-validator')
const router = require("express").Router()
const auth = require("../auth")
const database = require("../../services/database-service")

router.post("/",
  auth.required,
  body('serverId').isString(),
  database.getSystemServices)

module.exports = router
