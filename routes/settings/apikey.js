const router = require("express").Router()
const auth = require("../auth")
const authService = require("../../services/auth")

router.get("/", auth.required, authService.getApiKeys)

router.get("/regenerate", auth.required, authService.createApiKeys)

module.exports = router
