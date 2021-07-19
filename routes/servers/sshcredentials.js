const { body } = require('express-validator')
const router = require("express").Router()
const auth = require("../auth")
const system = require("../../services/system")

router.get("/", auth.required, system.getVaultedSSHKeys)

router.post("/create", 
  auth.required, 
  body('serverId').isString(),
  body('name').isString(),
  body('userName').isString(),
  body('publicKey').isString(),
  system.createSSHKey)

router.delete("/", 
  auth.required, 
  body('serverId').isString(),
  body('name').isString(),
  system.deleteSSHKey)


module.exports = router
