const { body } = require('express-validator')
const router = require("express").Router()
const auth = require("../auth")
const system = require("../../services/system")

router.get("/", auth.required, system.getServerSSHKeys)

router.get("/vault", auth.required, system.getVaultedSSHKeys)

router.post("/",
  auth.required,
  body('label').isString(),
  body('user').isString(),
  body('publickey').isString(),
  system.createServerSSHKey)

router.delete("/:keyId",
  auth.required,
  system.deleteServerSSHKey)


module.exports = router
