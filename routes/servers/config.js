const { body } = require("express-validator");
const router = require("express").Router();
const auth = require("../auth");
const validate = require("../validate");
const server = require("../../services/server-service");

router.post(
  "/shell",
  auth.required,
  body("address").isIP(4),
  validate,
  server.getShellCommands
);

router.get("/installscript", auth.required, server.getInstallScript);

router.get("/installstate/:state", server.getInstallState);

router.get("/script/:token", server.getScript);

module.exports = router;
