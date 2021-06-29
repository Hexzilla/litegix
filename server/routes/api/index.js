var router = require("express").Router()

router.use("/", require("./users"))
router.use("/profiles", require("./profiles"))
router.use("/articles", require("./articles"))
router.use("/installation", require("./installation"))

module.exports = router
