const { body } = require("express-validator");
const router = require("express").Router();
const auth = require("../auth");
const system = require("../../services/system");

router.get("/", auth.required, system.getServerSSHKeys);

router.get("/vault", auth.required, system.getVaultedSSHKeys);

router.get("/create", auth.required, system.createServerSSHKey);

router.post(
  "/",
  auth.required,
  body("label").isString(),
  body("userId").isString(),
  body("publicKey").isString(),
  system.storeServerSSHKey
);

router.delete("/:keyId", auth.required, system.deleteServerSSHKey);

module.exports = router;
