const { body } = require('express-validator')
const router = require("express").Router()
const auth = require("../auth")
const database = require("../../services/database")

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

router.get("/users", 
  auth.required, 
  database.getDatabaseUsers)
  
router.post("/users/store", 
  auth.required, 
  body('name').isString(),
  body('password').isString(),
  database.storeDatabaseUser)

router.delete("/users", 
  auth.required, 
  body('id').isString(),
  database.deleteDatabaseUser)

module.exports = router
