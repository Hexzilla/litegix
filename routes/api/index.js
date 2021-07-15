var router = require("express").Router()

router.use("/", require("./users"))
router.use("/profiles", require("./profiles"))
router.use("/articles", require("./articles"))
router.use("/installation", require("./installation"))
router.use("/agent", require("./agent"))

module.exports = router
