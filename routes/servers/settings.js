const { body } = require("express-validator");
const router = require("express").Router();
const auth = require("../auth");
const validate = require("../validate");
const server = require("../../services/server-service");

// router.get("/", auth.required, server.getServers)

router.get("/", auth.required, server.getServerInfo);

router.post(
  "/update",
  auth.required,
  body("name").notEmpty(),
  body("provider").notEmpty(),
  server.updateSetting
);

module.exports = router;
