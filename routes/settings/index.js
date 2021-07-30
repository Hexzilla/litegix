var router = require("express").Router()

router.use("/profile", require("./profile"))
router.use("/account", require("./account"))
router.use("/apikey", require("./apikey"))
router.use("/notifications", require("./notifications"))
router.use("/ipwhitelist", require("./ipwhitelist"))

module.exports = router
