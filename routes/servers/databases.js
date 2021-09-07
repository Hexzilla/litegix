const { body } = require("express-validator");
const router = require("express").Router();
const auth = require("../auth");
const validate = require("../validate");
const database = require("../../services/database-service");

router.get("/", auth.required, database.getDatabases);

router.get("/create", auth.required, database.createDatabase);

router.post(
  "/",
  auth.required,
  body("name").isString(),
  body("collation").isString(),
  validate,
  async function (req, res) {
    try {
      const response = await database.storeDatabase(req.server, req.body);
      res.json(response);
    } catch (e) {
      console.error(e);
      return res.status(501).json({ success: false });
    }
  }
);

router.get("/:databaseId/grant", auth.required, database.getUngrantedDBuser);

router.post(
  "/:databaseId/grant",
  auth.required,
  body("dbuserId").isString(),
  database.grantDBuser
);

router.delete(
  "/:databaseId/grant/:dbuserId",
  auth.required,
  database.revokeDBuser
);

router.delete("/:databaseId", auth.required, database.deleteDatabase);

router.get("/users", auth.required, database.getDatabaseUsers);

router.get("/users/:dbuserId", auth.required, database.getDatabaseUser);

router.post(
  "/users",
  auth.required,
  body("name").isString(),
  body("password").isString(),
  database.storeDatabaseUser
);

router.put(
  "/users/:dbuserId/password",
  auth.required,
  body("password").isString(),
  database.changePassword
);

router.delete("/users/:dbuserId", auth.required, database.deleteDatabaseUser);

module.exports = router;
