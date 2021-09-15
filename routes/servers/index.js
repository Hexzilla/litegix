const router = require("express").Router();
var mongoose = require("mongoose");
var Server = mongoose.model("Server");

// Preload server on routes with ':serverId'
router.param("serverId", function (req, res, next, serverId) {
  Server.findById(serverId)
    .then(function (server) {
      if (!server) {
        return res.sendStatus(404);
      }

      req.server = server;
      return next();
    })
    .catch(next);
});

router.use("/", require("./servers"));
router.use("/:serverId/config", require("./config"));
router.use("/:serverId/webapps", require("./webapps"));
router.use("/:serverId/databases", require("./databases"));
router.use("/:serverId/systemusers", require("./systemusers"));
router.use("/:serverId/sshcredentials", require("./credentials"));
router.use("/:serverId/deploykeys", require("./deploy-key"));
router.use("/:serverId/cronjobs", require("./cron-jobs"));
router.use("/:serverId/supervisors", require("./supervisors"));
router.use("/:serverId/notifications", require("./notifications"));
router.use("/:serverId/services", require("./services"));
router.use("/:serverId/securities", require("./securities"));
router.use("/:serverId/settings", require("./settings"));
router.use("/:serverId/activities", require("./activity"));
router.use("/:serverId", require("./server"));

module.exports = router;
