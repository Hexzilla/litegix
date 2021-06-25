var router = require("express").Router()

router.use("/profile", require("./profile"))
router.use("/account", require("./account"))
router.use("/apikey", require("./apikey"))

module.exports = router