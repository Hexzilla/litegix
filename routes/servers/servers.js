const { body } = require("express-validator");
const router = require("express").Router();
const auth = require("../auth");
const validate = require("../validate");
const server = require("../../services/server");

router.get("/", auth.required, server.getServers);

router.post(
  "/store",
  auth.required,
  body("name").notEmpty(),
  body("address").isIP(4),
  body("web_server").notEmpty(),
  body("database").notEmpty(),
  body("phpVersion").notEmpty(),
  validate,
  server.storeServer
);

module.exports = router;
