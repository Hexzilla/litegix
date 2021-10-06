const router = require("express").Router()

router.use("/database", require("./database"))

module.exports = router
