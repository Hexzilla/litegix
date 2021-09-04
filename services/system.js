const valiator = require("express-validator");
const { getServer } = require("./server");
const { getUser } = require("./auth");
const mongoose = require("mongoose");
const SystemUser = mongoose.model("SystemUser");
const SSHKey = mongoose.model("SSHKey");
const ServerSSHKey = mongoose.model("ServerSSHKey");
const agent = require("./agent");
const activity = require("./activity");

const getSystemUsers = async function (req, res) {
  try {
    const users = await SystemUser.find({ serverId: req.server.id });
    return res.json({
      success: true,
      data: { users: users },
    });
  } catch (e) {
    console.error(e);
    return res.status(501).json({ success: false });
  }
};

const getSystemUserFromId = async function (req, res) {
  try {
    const users = await SystemUser.find({
      serverId: req.server.id,
      _id: req.params.userId,
    });
    return res.json({
      success: true,
      data: { users: users },
    });
  } catch (e) {
    console.error(e);
    return res.status(501).json({ success: false });
  }
};

const createSystemUser = async function (req, res) {
  try {
    res.json({
      success: true,
      data: {},
    });
  } catch (e) {
    console.error(e);
    return res.status(501).json({ success: false });
  }
};

const storeSystemUser = async function (req, res) {
  try {
    let errors = valiator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }

    let server = req.server;
    let user = await SystemUser.findOne({
      serverId: server.id,
      name: req.body.name,
    });
    if (user) {
      return res.status(422).json({
        success: false,
        errors: { name: "has already been taken." },
      });
    }

    // errors = await agent.createSystemUser(req.body)
    // if (errors) {
    //   return res.status(422).json({
    //     success: false,
    //     errors: errors
    //   })
    // }

    user = new SystemUser(req.body);
    user.serverId = server.id;
    await user.save();

    const message = `Added new system user ${req.body.name} with password`;
    await activity.createServerActivityLogInfo(server.id, message);

    res.json({
      success: true,
      message: "It has been successfully created.",
    });
  } catch (e) {
    console.error(e);
    return res.status(501).json({ success: false });
  }
};

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

const deleteSystemUser = async function (req, res) {
  try {
    let user = await SystemUser.findById(req.params.userId);
    if (!user) {
      return res.status(422).json({
        success: false,
        errors: { message: "It doesn't exists" },
      });
    }

    // errors = await agent.deleteSystemUser(user.name)
    // if (errors) {
    //   return res.status(422).json({ success: false, errors: errors })
    // }

    await user.remove();

    const message = `Deleted system user ${req.body.name}`;
    await activity.createServerActivityLogInfo(req.body.serverId, message);

    res.json({
      success: true,
      message: "It has been successfully deleted.",
    });
  } catch (e) {
    console.error(e);
    return res.status(501).json({ success: false });
  }
};

const getServerSSHKeys = async function (req, res) {
  try {
    let server = req.server;
    const sshKeys = await ServerSSHKey.find({ serverId: server.id });

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

const createServerSSHKey = async function (req, res) {
  try {
    const errors = valiator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }

    const server = req.server;

    const serverSSHKey = await ServerSSHKey.find({
      serverId: server.id,
      label: req.body.label,
    });
    if (serverSSHKey) {
      return res.status(422).json({
        success: false,
        errors: {
          message: "Label is duplicated",
        },
      });
    }

    // errors = await agent.createSSHKey(req.body)
    // if (errors) {
    //   return res.status(422).json({
    //     success: false,
    //     errors: errors
    //   })
    // }

    serverSSHKey = new ServerSSHKey(req.body);
    serverSSHKey.serverId = server.id;
    await serverSSHKey.save();

    const message = `Added new SSH key ${req.body.label} with user ${req.body.userId}`;
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

const deleteServerSSHKey = async function (req, res) {
  try {
    let server = req.server;
    await SSHKey.deleteOne({
      serverId: server.id,
      id: req.params.keyId,
    });

    res.json({
      success: true,
      message: "Server SSH Key has been successfully deleted.",
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

const getDeploymentKeys = async function (req, res) {
  try {
    let { server, errors } = await getServer(req);
    if (errors) {
      return res.status(422).json({ success: false, errors: errors });
    }

    res.json({
      success: true,
      data: {
        deploymentKeys: server.deploymentKeys,
      },
    });
  } catch (error) {
    return res.status(501).json({
      success: false,
      errors: error,
    });
  }
};

const createDeploymentKey = async function (req, res) {
  try {
    let { server, errors } = await getServer(req);
    if (errors) {
      return res.status(422).json({ success: false, errors: errors });
    }

    if (server.deploymentKeys.find((it) => it.name === req.body.name)) {
      return res.status(422).json({
        success: false,
        errors: {
          message: "Label is duplicated",
        },
      });
    }

    errors = await agent.createDeploymentKey(req.body);
    if (errors) {
      return res.status(422).json({
        success: false,
        errors: errors,
      });
    }

    server.deploymentKeys.push(req.body);
    await server.save();

    const message = `Added new deployment key ${req.body.name} with user ${req.body.userName}`;
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

const deleteDeploymentKey = async function (req, res) {
  try {
    let { server, errors } = await getServer(req);
    if (errors) {
      return res.status(422).json({ success: false, errors: errors });
    }

    const index = server.deploymentKeys.findIndex(
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

    errors = await agent.deleteDeploymentKey(req.body.name);
    if (errors) {
      return res.status(422).json({
        success: false,
        errors: errors,
      });
    }

    server.deploymentKeys.splice(index, 1);
    await server.save();

    res.json({
      success: true,
      message: "Deployment Key has been successfully deleted.",
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
  getSystemUsers,
  getSystemUserFromId,
  createSystemUser,
  storeSystemUser,
  changeSystemUserPassword,
  deleteSystemUser,
  getServerSSHKeys,
  getVaultedSSHKeys,
  createServerSSHKey,
  deleteServerSSHKey,
  deleteVaultedSSHKey,
  getDeploymentKeys,
  createDeploymentKey,
  deleteDeploymentKey,
  getSupervisorJobs,
  createSupervisorJob,
  deleteSupervisorJob,
};
