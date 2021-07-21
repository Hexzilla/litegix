const { body } = require('express-validator')
const router = require("express").Router()
const auth = require("../auth")
const whitelist = require("../../services/ipwhitelist")

router.get("/", 
  auth.required,
  whitelist.getWhiteList)

module.exports = router
