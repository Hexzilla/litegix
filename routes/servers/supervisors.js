const { body } = require("express-validator");
const router = require("express").Router();
const auth = require("../auth");
const system = require("../../services/system-service");

router.get(
  "/",
  auth.required,
  body("serverId").isString(),
  system.getSupervisorJobs
);

router.post(
  "/create",
  auth.required,
  body("serverId").isString(),
  body("name").isString(),
  body("userName").isString(),
  body("numprocs").isNumeric(),
  body("vendorBinary").isString(),
  body("command").isString(),
  body("autoStart").isBoolean(),
  body("autoRestart").isBoolean(),
  system.createSupervisorJob
);

router.delete(
  "/",
  auth.required,
  body("serverId").isString(),
  body("name").isString(),
  system.deleteSupervisorJob
);

module.exports = router;
