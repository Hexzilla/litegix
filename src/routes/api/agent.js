const { body } = require("express-validator");
const router = require("express").Router();
const validate = require("../validate");
const server = require("../../services/server-service");

router.post(
  "/:serverId/monitor/state",
  body("memory").notEmpty(),
  body("cpu").notEmpty(),
  body("disk").notEmpty(),
  body("loadavg").notEmpty(),
  validate,
  server.updateServerUsage
);

module.exports = router;
