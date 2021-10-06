const { body } = require('express-validator')
const router = require("express").Router()
const auth = require("../auth")
const whitelist = require("../../services/ipwhitelist")

router.get("/", 
  auth.required,
  whitelist.getWhiteList)

router.delete("/:ipAddress",
  auth.required,
  whitelist.deleteIp) 

router.post("/:isEnable",
  auth.required,
  whitelist.setEnableOrDisable) 

module.exports = router
