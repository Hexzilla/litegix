const { body } = require('express-validator')
const router = require("express").Router()
const auth = require("../auth")
const database = require("../../services/database-service")

router.post("/", 
  auth.required, 
  body('serverId').isString(),
  database.getDatabases)

router.post("/create", 
  auth.required, 
  body('name').isString(),
  body('serverId').isString(),
  body('collection').isString(),
  database.createDatabase)

module.exports = router
