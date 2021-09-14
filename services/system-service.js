const valiator = require("express-validator");
const uuid = require("uuid");
const { getServer } = require("./server-service");
const { getUser } = require("./auth");
const mongoose = require("mongoose");
const SystemUser = mongoose.model("SystemUser");
const SSHKey = mongoose.model("SSHKey");
const ServerSSHKey = mongoose.model("ServerSSHKey");
const CronJob = mongoose.model("CronJob");
const agent = require("./agent");
const activity = require("./activity");

const changeSystemUserPassword = async function (req, res) {
  try {
    let errors = valiator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }

    await SystemUser.findByIdAndUpdate(
      req.body.id,
      { $set: { password: req.body.password } },
      { upsert: true },
      function (err, result) {
        if (err) {
          return res.status(422).json({
            success: false,
            errors: err,
          });
        } else {
          res.json({
            success: true,
            data: result,
          });
        }
      }
    );

    let server = req.server;
    let user = await SystemUser.findById(req.body.id);
    if (!user) {
      return res.status(422).json({
        success: false,
        errors: { message: "User isn't exists" },
      });
    }

    // errors = await agent.changeSystemUserPassword(user.name, req.body.password)
    // if (errors) {
    //   return res.status(422).json({
    //     success: false,
    //     errors: errors
    //   })
    // }

    const message = `The password for system user ${user.name} is changed`;
    await activity.createServerActivityLogInfo(server.id, message);

    res.json({
      success: true,
      message: "Password has been successfully changed.",
    });
  } catch (e) {
    console.error(e);
    return res.status(501).json({ success: false });
  }
};

const getVaultedSSHKeys = async function (req, res) {
  try {
    const sshKeys = await SSHKey.find({ userId: req.payload.id });

    res.json({
      success: true,
      data: {
        sshKeys: sshKeys,
        // sshKeys: sshKeys.map(it => it.name)
      },
    });
  } catch (error) {
    return res.status(501).json({
      success: false,
      errors: error,
    });
  }
};

const deleteVaultedSSHKey = async function (req, res) {
  try {
    await SSHKey.deleteOne({
      userId: req.payload.id,
      id: req.params.keyId,
    });

    res.json({
      success: true,
      message: "SSH Key has been successfully deleted.",
    });
  } catch (error) {
    return res.status(501).json({
      success: false,
      errors: error,
    });
  }
};

const getSupervisorJobs = async function (req, res) {
  try {
    let { server, errors } = await getServer(req);
    if (errors) {
      return res.status(422).json({ success: false, errors: errors });
    }

    res.json({
      success: true,
      data: {
        supervisors: server.supervisors,
      },
    });
  } catch (error) {
    return res.status(501).json({
      success: false,
      errors: error,
    });
  }
};

const createSupervisorJob = async function (req, res) {
  try {
    let { server, errors } = await getServer(req);
    if (errors) {
      return res.status(422).json({ success: false, errors: errors });
    }

    if (server.supervisors.find((it) => it.name === req.body.name)) {
      return res.status(422).json({
        success: false,
        errors: { name: "has already been taken." },
      });
    }

    errors = await agent.createSupervisorJob(req.body);
    if (errors) {
      return res.status(422).json({
        success: false,
        errors: errors,
      });
    }

    server.supervisors.push(req.body);
    await server.save();

    const message = `Added new supervisor job ${req.body.name}`;
    await activity.createServerActivityLogInfo(req.body.serverId, message);

    res.json({
      success: true,
      message: "It has been successfully created.",
    });
  } catch (error) {
    return res.status(501).json({
      success: false,
      errors: error,
    });
  }
};

const deleteSupervisorJob = async function (req, res) {
  try {
    let { server, errors } = await getServer(req);
    if (errors) {
      return res.status(422).json({ success: false, errors: errors });
    }

    const index = server.supervisors.findIndex(
      (it) => it.name === req.body.name
    );
    if (index < 0) {
      return res.status(422).json({
        success: false,
        errors: {
          message: "It doesn't exists",
        },
      });
    }

    errors = await agent.deleteSupervisorJob(req.body.name);
    if (errors) {
      return res.status(422).json({
        success: false,
        errors: errors,
      });
    }

    server.supervisors.splice(index, 1);
    await server.save();

    res.json({
      success: true,
      message: "It has been successfully deleted.",
    });
  } catch (error) {
    return res.status(501).json({
      success: false,
      errors: error,
    });
  }
};

module.exports = {
  getSystemUsers: async function (server) {
    const users = await SystemUser.find({ serverId: server.id });
    return {
      success: true,
      data: { users: users.map((it) => it.getJson()) },
    };
  },

  getSystemUserById: async function (server, userId) {
    const users = await SystemUser.find({
      serverId: server.id,
      _id: userId,
    });
    return {
      success: true,
      data: { users: users },
    };
  },

  createSystemUser: async function (server, data) {},

  storeSystemUser: async function (server, data) {
    const exists = await SystemUser.findOne({
      serverId: server.id,
      name: data.name,
    });
    if (exists) {
      return {
        success: false,
        errors: { name: "has already been taken." },
      };
    }

    // errors = await agent.createSystemUser(data)
    // if (errors) {
    //   return res.status(422).json({
    //     success: false,
    //     errors: errors
    //   })
    // }

    const user = new SystemUser(data);
    user.serverId = server.id;
    await user.save();

    const message = `Added new system user ${user.name} with password`;
    await activity.createServerActivityLogInfo(server.id, message);

    return {
      success: true,
      data: { user: user },
    };
  },

  changeSystemUserPassword,

  deleteSystemUser: async function (server, userId) {
    const user = await SystemUser.findById(userId);
    if (!user) {
      return {
        success: false,
        errors: { message: "It doesn't exists" },
      };
    }

    // errors = await agent.deleteSystemUser(user.name)
    // if (errors) {
    //   return { success: false, errors: errors }
    // }

    await user.remove();

    const message = `Deleted system user ${user.name}`;
    await activity.createServerActivityLogInfo(server.id, message);

    return {
      success: true,
      data: { id: userId },
    };
  },

  getServerSSHKeys: async function (server) {
    const sshKeys = await ServerSSHKey.find({ serverId: server.id });

    return {
      success: true,
      data: {
        sshKeys: sshKeys,
        // sshKeys: sshKeys.map(it => it.name)
      },
    };
  },

  getVaultedSSHKeys,

  createServerSSHKey: async function (server) {
    const systemusers = await SystemUser.find({
      serverId: server.id,
    });
    return {
      success: true,
      data: {
        systemusers: systemusers.map((it) => it.getJson()),
      },
    };
  },

  storeServerSSHKey: async function (server, data) {
    const exists = await ServerSSHKey.find({
      serverId: server.id,
      label: data.label,
    });
    if (exists && exists.length > 0) {
      return {
        success: false,
        errors: { message: "Label is duplicated" },
      };
    }

    /*errors = await agent.createSSHKey(data)
    if (errors) {
      return res.status(422).json({
        success: false,
        errors: errors
      })
    }*/

    const sshkey = new ServerSSHKey(data);
    sshkey.serverId = server.id;
    await sshkey.save();

    const message = `Added new SSH key ${data.label} with user ${data.userId}`;
    await activity.createServerActivityLogInfo(server.id, message);

    return {
      success: true,
      data: { sshkey: sshkey },
    };
  },

  deleteServerSSHKey: async function (server, keyId) {
    const result = await SSHKey.deleteOne({
      serverId: server.id,
      id: req.params.keyId,
    });

    return {
      success: true,
      data: { id: keyId },
    };
  },

  deleteVaultedSSHKey,

  getDeploymentKeys: async function (server) {
    const users = await SystemUser.find({ serverId: server.id });
    return {
      success: true,
      data: { keys: users.map((it) => it.toDeploymentKeyJson()) },
    };
  },

  storeDeploymentKey: async function (server, userId) {
    const user = await SystemUser.findById(userId);
    if (!user) {
      return {
        success: false,
        errors: { userId: "doesn't exists." },
      };
    }

    const deploymentKey = `TEST_PUBLIC_KEY_${userId}_${uuid.v4()}`;

    // errors = await agent.storeDeploymentKey(userId, deploymentKey)
    // if (errors) {
    //   return { success: false, errors: errors }
    // }

    user.deploymentKey = deploymentKey;
    await user.save();

    const message = `Created new deployment key for system user ${user.name}`;
    await activity.createServerActivityLogInfo(server.id, message);

    return {
      success: true,
      data: { key: deploymentKey },
    };
  },

  getSupervisorJobs,
  createSupervisorJob,
  deleteSupervisorJob,

  getCronJobList: async function (server) {
    const cronjobs = await CronJob.find({ serverId: server.id });
    return {
      success: true,
      data: { cronjobs },
    };
  },

  getCronJobById: async function (jobId) {
    const cronjob = await CronJob.findById(jobId);
    return {
      success: true,
      data: { cronjob },
    };
  },

  storeCronJob: async function (server, data) {
    const exists = await CronJob.findOne({
      serverId: server.id,
      label: data.label,
    });
    if (exists) {
      return {
        success: false,
        errors: { label: "has already been taken." },
      };
    }

    // errors = await agent.createCronJob(data)
    // if (errors) {
    //   return { success: false, errors: errors })
    // }

    data.time = [
      data.minute,
      data.hour,
      data.dayOfMonth,
      data.month,
      data.dayOfWeek,
    ].join(" ");
    console.log(data);

    const cronjob = new CronJob(data);
    cronjob.serverId = server.id;
    await cronjob.save();

    const message = `Added new Cron Job ${data.label}`;
    await activity.createServerActivityLogInfo(server.id, message);

    return {
      success: true,
      message: "It has been successfully created.",
    };
  },

  getPhpVersions: async function (server) {
    return {
      success: true,
      data: {
        phpVersion: "7.2",
        versions: ["7.2", "7.4", "8.0"],
      },
    };
  },
};
