const router = require("express").Router()
var mongoose = require("mongoose")
var Server = mongoose.model("Server")

// Preload server on routes with ':serverId'
router.param("serverId", function (req, res, next, serverId) {
  Server.findById(serverId)
    .then(function (server) {
      if (!server) {
        return res.sendStatus(404)
      }
      req.server = server
      return next()
    })
    .catch(next)
})

router.use("/", require("./servers"))
router.use("/:serverId", require("./server"))
router.use("/:serverId/config", require("./config"))
router.use("/:serverId/webapp", require("./webapp"))
router.use("/:serverId/databases", require("./databases"))
router.use("/:serverId/systemusers", require("./systemusers"))
router.use("/:serverId/sshcredentials", require("./sshcredentials"))
router.use("/:serverId/deploymentkeys", require("./deploymentkeys"))
router.use("/:serverId/phpcli", require("./phpcli"))
router.use("/:serverId/cronjobs", require("./cronjobs"))
router.use("/:serverId/supervisors", require("./supervisors"))
router.use("/:serverId/notifications", require("./notifications"))
router.use("/:serverId/services", require("./services"))
router.use("/:serverId/securities", require("./securities"))
router.use("/:serverId/settings", require("./settings"))
router.use("/:serverId/logs", require("./logs"))


module.exports = router
