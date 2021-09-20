const path = require("path");
const fs = require("fs");
const util = require("util");
const readFile = util.promisify(fs.readFile);
const valiator = require("express-validator");
const mongoose = require("mongoose");
const Server = mongoose.model("Server");
const Usage = mongoose.model("Usage");
const User = mongoose.model("User");
const ActivityLog = mongoose.model("ActivityLog");
const config = require("./config");

const crypto = require("./crypto");
const { exception } = require("console");

const defaultScript =
  "export DEBIAN_FRONTEND=noninteractive; echo 'Acquire::ForceIPv4 \"true\";' | tee /etc/apt/apt.conf.d/99force-ipv4; apt-get update; apt-get install curl netcat-openbsd -y; curl -4 --silent --location http://localhost:3000/servers/config/script/USER_INFO | bash -; export DEBIAN_FRONTEND=newt";

const getSummary = async function (req, res, next) {
  console.log("getSummary", req.server);
  let server = req.server;
  server.system = {
    kernelVersion: "5.4.0-72-generic",
    processorName: "Intel Xeon Processor (Skylake, IBRS)",
    totalCPUCore: 2,
    totalMemory: 3.750080108642578,
    freeMemory: 3.2643470764160156,
    diskTotal: 40.18845696,
    diskFree: 33.756172288,
    loadAvg: 16,
    uptime: "475h 50m 20s",
  };
  await server.save();

  res.json({
    success: true,
    data: server.toSummaryJSON(),
  });
};

const encryptToken = (payload) => {
  const encrypted = crypto.encrypt(JSON.stringify(payload));
  return encrypted.split("/").join(".");
};

const decryptToken = function (token) {
  const encrypted = token.split(".").join("/");
  const decrypted = crypto.decrypt(encrypted);
  return JSON.parse(decrypted);
};

const getInstallState = async function (req, res, next) {
  var sta = req.params.state;
  res.json({
    success: true,
    data: {
      state: sta / 1 + 5,
    },
  });
};

const updateInstallState = async function (req, res, next) {
  const token = getToken(req.params.token);
  console.log("updateInstallState, Token:", token, req.body);
  res.json({
    success: true,
  });
};

const updateServerState = async function (req, res) {
  console.log("updateServerState", req.body);

  const usage = new Usage(req.body);
  usage.serverId = req.server.id;
  await usage.save();

  res.json({
    success: true,
  });
};

// get method
// getting Server by url param serverId
const getServerInfo = async function (req, res, next) {
  try {
    var server = req.server;
    // console.log(server.useremail);
    // console.log(server.user);
    if (
      (server.useremail == undefined ||
        !server.useremail ||
        server.useremail == "") &&
      server.user
    ) {
      var userId = server.user;
      ServerUser = await User.findById(userId);
      //console.log(ServerUser);
      if (ServerUser) {
        server.useremail = ServerUser.email;
      }
    }

    res.json({
      success: true,
      data: server,
    });
  } catch (e) {
    console.error(e);
    return res.status(501).json({
      success: false,
    });
  }
};

// post method
// getting Server by postted serverId
const getServer = async function (req) {
  try {
    const reject = (errors) => {
      return {
        errors: errors,
      };
    };

    const errors = valiator.validationResult(req);
    if (!errors.isEmpty()) {
      return reject(errors.array());
    }

    const server = await Server.findById(req.body.serverId);
    if (!server) {
      return reject({
        message: "Server doesn't exists",
      });
    }

    if (
      (server.useremail == undefined ||
        !server.useremail ||
        server.useremail == "") &&
      server.user
    ) {
      var userId = server.user;
      ServerUser = await User.findById(userId);
      //console.log(ServerUser);
      if (ServerUser) {
        server.useremail = ServerUser.email;
      }
    }
    return {
      server,
    };
  } catch (errors) {
    return {
      errors: errors,
    };
  }
};

const updateSetting = async function (req, res, next) {
  try {
    const errors = valiator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array(),
      });
    }

    //console.log(req.body); return;
    var myServer = req.server;
    let otherCount = await Server.count({
      $and: [{ _id: { $ne: req.payload.id } }, { name: req.body.name }],
    });
    if (otherCount > 0) {
      return res.status(423).json({
        success: false,
        errors: {
          name: " has already been taken.",
        },
      });
    }

    myServer.name = req.body.name;
    myServer.provider = req.body.provider;
    await myServer.save();
    res.json({
      success: true,
      message: "Server setting has been successfully updated.",
    });
  } catch (e) {
    console.error(e);
    return res.status(501).json({
      success: false,
    });
  }
};

module.exports = {
  getServer,

  getServers: async function (userId) {
    const servers = await Server.find({ userId: userId });
    return {
      success: true,
      data: {
        userId: userId,
        servers: servers,
      },
    };
  },

  storeServer: async (userId, data) => {
    const searchByAddress = await Server.findOne({
      address: data.address,
    });
    if (searchByAddress) {
      return {
        success: false,
        errors: {
          address: "has already been taken.",
        },
      };
    }

    const searchByName = await Server.findOne({
      name: data.name,
      userId: userId,
    });
    if (searchByName) {
      return {
        success: false,
        errors: {
          name: "has already been taken.",
        },
      };
    }

    const server = new Server(data);
    server.connected = false;
    server.userId = userId;
    await server.save();

    return {
      success: true,
      data: { id: server._id },
    };
  },

  deleteServer: async function (server) {
    await server.delete();

    return {
      success: true,
      data: { id: server._id },
    };
  },

  getSummary,

  getInstallShell: async function (userId, server) {
    const payload = {
      userId,
      serverId: server.id,
    };
    const token = encryptToken(payload);
    return {
      success: true,
      data: {
        name: server.name,
        loginScript: "ssh root@" + server.address,
        installScript: config.install_script(token),
      },
    };
  },

  getScriptFile: async function (encryptedToken) {
    const token = decryptToken(encryptedToken);
    console.log("getScriptFile, Token:", token);

    const filePath = path.join(__dirname, "../scripts/install.sh");
    const text = await readFile(filePath, "utf8");
    return text;
  },

  getInstallState,
  updateInstallState,
  updateServerState,
  getServerInfo,
  updateSetting,

  getPhpVersion: async function (server) {
    return {
      success: true,
      data: {
        avaliable: ["7.2", "7.4", "8.0"],
        phpVersion: server.phpVersion,
      },
    };
  },

  updatePhpVersion: async function (server, version) {
    server.phpVersion = version;
    await server.save();

    return {
      success: true,
      data: {
        id: server._id,
        phpVersion: version,
      },
    };
  },
};
