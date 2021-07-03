const { body } = require('express-validator')
const router = require("express").Router()
const auth = require("../auth")
const database = require("../../services/database-service")

router.get("/", 
  auth.required, 
  database.getDatabases)

router.get("/create", 
  auth.required, 
  database.createDatabase)

router.post("/store", 
  auth.required, 
  body('name').isString(),
  body('encoding').isString(),
  database.storeDatabase)

router.delete("/",
  auth.required, 
  body('id').isString(),
  database.deleteDatabase)

router.post("/users", 
  auth.required, 
  body('serverId').isString(),
  database.getDatabaseUsers)
  
router.post("/users/create", 
  auth.required, 
  body('serverId').isString(),
  body('name').isString(),
  body('password').isString(),
  body('confirm_password').isString(),
  database.createDatabaseUser)

router.delete("/users", 
  auth.required, 
  body('serverId').isString(),
  body('name').isString(),
  database.deleteDatabaseUser)

module.exports = router
