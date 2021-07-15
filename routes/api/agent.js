const { body } = require('express-validator')
const router = require('express').Router();
const mongoose = require('mongoose');
const Server = mongoose.model("Server")
const server = require("../../services/server")

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

router.post('/:serverId/monitor/state',
  body('memory').notEmpty(),
  body('cpu').notEmpty(),
  body('disk').notEmpty(),
  body('loadavg').notEmpty(),
  server.updateServerState);

module.exports = router;
