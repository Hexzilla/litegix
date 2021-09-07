const valiator = require("express-validator");
const { getServer } = require("./server");
const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
const Database = mongoose.model("Database");
const DatabaseUser = mongoose.model("DatabaseUser");
const agent = require("./agent");
const activity = require("./activity");

module.exports = {
  getDatabases: async function (req, res) {
    try {
      let server = req.server;
      let results = [];
      await Database.find({ serverId: server.id })
        .then(function (databases) {
          var userQueries = [];
          results = databases;
          databases.forEach(function (database) {
            userQueries.push(
              DatabaseUser.find({ _id: { $in: database.users } })
            );
          });

          return Promise.all(userQueries);
        })
        .then(function (userlist) {
          for (var i = 0; i < userlist.length; i++) {
            results[i].users = userlist[i];
          }
          return res.json({
            success: true,
            data: { results },
          });
        });
    } catch (e) {
      console.error(e);
      return res.status(501).json({ success: false });
    }
  },

  createDatabase: async function (req, res) {
    return res.json({
      success: true,
      data: {
        users: ["runcloud", "dbuser"],
        collations: ["utf8_general_ci", "utf16_general_ci"],
      },
    });
  },

  storeDatabase: async function (server, data) {
    const exists = await Database.findOne({
      serverId: server.id,
      name: data.name,
    });
    if (exists) {
      return {
        success: false,
        errors: { name: "has already been taken." },
      };
    }

    /*errors = await agent.createDatabase(server.address, data)
    if (errors) {
      return res.status(422).json({
        success: false,
        errors: errors
      })
    }*/

    const options = { ...data };
    if (data.userId) {
      const user = await DatabaseUser.findById(data.userId);
      if (!user) {
        return {
          success: false,
          errors: { user: "doesn't exists." },
        };
      }
      options.users = [data.userId];
    }
    const database = new Database(options);
    database.serverId = server.id;
    await database.save();

    const message = `Added new database ${data.name} with collation ${data.collation}`;
    await activity.createServerActivityLogInfo(server.id, message);

    return {
      success: true,
      message: "It has been successfully created.",
      database: database,
    };
  },

  getUngrantedDBuser: async function (req, res) {
    try {
      let errors = valiator.validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ success: false, errors: errors.array() });
      }

      let server = req.server;
      const database = await Database.findById(req.params.databaseId);
      if (!database) {
        return res.status(422).json({
          success: false,
          errors: { message: "Database doesn't exists" },
        });
      }

      const ungrantedusers = await DatabaseUser.find({
        _id: { $nin: database.users },
      });

      return res.json({
        success: true,
        data: { ungrantedusers },
      });
    } catch (e) {
      console.error(e);
      return res.status(501).json({ success: false });
    }
  },

  grantDBuser: async function (req, res) {
    try {
      let errors = valiator.validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ success: false, errors: errors.array() });
      }

      const database = await Database.findById(req.params.databaseId);
      if (!database) {
        return res.status(422).json({
          success: false,
          errors: { message: "Database doesn't exists" },
        });
      }

      const dbuser = await DatabaseUser.findById(req.body.dbuserId);
      if (!dbuser) {
        return res.status(422).json({
          success: false,
          errors: { message: "user doesn't exists" },
        });
      }

      if (database.users.includes(req.body.dbuserId)) {
        return res.status(422).json({
          success: false,
          errors: { message: "user already granted in database" },
        });
      }

      database.users.push(req.body.dbuserId);
      await database.save();

      return res.json({
        success: true,
        message: "It has been successfully granted.",
      });
    } catch (e) {
      console.error(e);
      return res.status(501).json({ success: false });
    }
  },

  revokeDBuser: async function (req, res) {
    try {
      let errors = valiator.validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ success: false, errors: errors.array() });
      }

      const database = await Database.findById(req.params.databaseId);
      if (!database) {
        return res.status(422).json({
          success: false,
          errors: { message: "Database doesn't exists" },
        });
      }

      const dbuser = await DatabaseUser.findById(req.params.dbuserId);
      if (!dbuser) {
        return res.status(422).json({
          success: false,
          errors: { message: "user doesn't exists" },
        });
      }

      let gIndex = database.users.indexOf(req.params.dbuserId);
      if (gIndex < 0) {
        return res.status(422).json({
          success: false,
          errors: { message: "user not granted in database" },
        });
      }

      database.users.splice(gIndex, 1);
      await database.save();

      return res.json({
        success: true,
        message: "It has been successfully granted.",
      });
    } catch (e) {
      console.error(e);
      return res.status(501).json({ success: false });
    }
  },

  deleteDatabase: async function (req, res) {
    try {
      let database = await Database.findById(req.params.databaseId);
      if (!database) {
        return res.status(422).json({
          success: false,
          errors: { message: "It doesn't exists" },
        });
      }

      // errors = await agent.deleteDatabase(database.name)
      // if (errors) {
      //   return res.status(422).json({ success: false, errors: errors })
      // }

      await database.remove();

      const message = `Deleted database ${req.body.name}`;
      await activity.createServerActivityLogInfo(req.body.serverId, message);

      res.json({
        success: true,
        message: "It has been successfully deleted.",
      });
    } catch (e) {
      console.error(e);
      return res.status(501).json({ success: false });
    }
  },

  getDatabaseUser: async function (req, res) {
    try {
      const dbuser = await DatabaseUser.findById(req.params.dbuserId);
      if (!dbuser) {
        return res.status(422).json({
          success: false,
          errors: {
            message: "User doesn't exists",
          },
        });
      }
      return res.json({
        success: true,
        data: { dbuser: dbuser },
      });
    } catch (e) {
      console.error(e);
      return res.status(501).json({ success: false });
    }
  },

  getDatabaseUsers: async function (req, res) {
    try {
      const users = await DatabaseUser.find({ serverId: req.server.id });
      return res.json({
        success: true,
        data: { dbusers: users },
      });
    } catch (e) {
      console.error(e);
      return res.status(501).json({ success: false });
    }
  },

  createDatabaseUser: async function (req, res) {
    return res.json({
      success: true,
      data: {},
    });
  },

  changePassword: async function (req, res) {
    try {
      let errors = valiator.validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ success: false, errors: errors.array() });
      }

      let user = await DatabaseUser.findById(req.params.dbuserId);
      if (!user) {
        return res.status(422).json({
          success: false,
          errors: { message: "It doesn't exists" },
        });
      }

      user.password = req.body.password;
      await user.save();

      const message = `successfully password changed for ${user.name}`;
      await activity.createServerActivityLogInfo(req.params.serverId, message);

      res.json({
        success: true,
        message: "It has been successfully changed.",
      });
    } catch (e) {
      console.error(e);
      return res.status(501).json({ success: false });
    }
  },

  storeDatabaseUser: async function (req, res) {
    try {
      let errors = valiator.validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ success: false, errors: errors.array() });
      }

      let server = req.server;
      let user = await DatabaseUser.findOne({
        serverId: server.id,
        name: req.body.name,
      });
      if (user) {
        return res.status(422).json({
          success: false,
          errors: { name: "has already been taken." },
        });
      }

      // errors = await agent.createDatabaseUser(req.body)
      // if (errors) {
      //   return res.status(422).json({
      //     success: false,
      //     errors: errors
      //   })
      // }

      user = new DatabaseUser(req.body);
      user.serverId = server.id;
      await user.save();

      const message = `Added new database user ${req.body.name} with password`;
      await activity.createServerActivityLogInfo(server.id, message);

      res.json({
        success: true,
        message: "It has been successfully created.",
      });
    } catch (e) {
      console.error(e);
      return res.status(501).json({ success: false });
    }
  },

  deleteDatabaseUser: async function (req, res) {
    try {
      let errors = valiator.validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ success: false, errors: errors.array() });
      }

      let user = await DatabaseUser.findById(req.params.dbuserId);
      if (!user) {
        return res.status(422).json({
          success: false,
          errors: { message: "It doesn't exists" },
        });
      }

      // errors = await agent.deleteDatabaseUser(user.name)
      // if (errors) {
      //   return res.status(422).json({ success: false, errors: errors })
      // }

      await user.remove();

      const message = `Deleted database user ${user.name}`;
      await activity.createServerActivityLogInfo(req.params.serverId, message);

      res.json({
        success: true,
        message: "It has been successfully deleted.",
      });
    } catch (e) {
      console.error(e);
      return res.status(501).json({ success: false });
    }
  },
  getPhpVersion: async function (req, res) {
    try {
      let { server, errors } = await getServer(req);
      if (errors) {
        return res.status(422).json({ success: false, errors: errors });
      }

      res.json({
        success: true,
        data: {
          phpVersion: server.phpVersion,
        },
      });
    } catch (error) {
      return res.status(501).json({
        success: false,
        errors: error,
      });
    }
  },
};
