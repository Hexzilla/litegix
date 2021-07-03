const router = require("express").Router()

router.use("/", require("./servers"))
router.use("/config", require("./config"))
router.use("/webapp", require("./webapp"))
router.use("/databases", require("./databases"))
router.use("/systemusers", require("./systemusers"))
router.use("/sshcredentials", require("./sshcredentials"))
router.use("/deploymentkeys", require("./deploymentkeys"))
router.use("/phpcli", require("./phpcli"))
router.use("/cronjobs", require("./cronjobs"))
router.use("/supervisors", require("./supervisors"))
router.use("/notifications", require("./notifications"))
router.use("/services", require("./services"))
router.use("/securities", require("./securities"))
router.use("/settings", require("./settings"))
router.use("/logs", require("./logs"))


module.exports = router
