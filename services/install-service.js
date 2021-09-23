const path = require("path");
const fs = require("fs");
const util = require("util");
const readFile = util.promisify(fs.readFile);
const valiator = require("express-validator");
const mongoose = require("mongoose");
const Server = mongoose.model("Server");
const Usage = mongoose.model("Usage");
const User = mongoose.model("User");
const config = require("./config");

const crypto = require("./crypto");

const encryptToken = (payload) => {
  const encrypted = crypto.encrypt(JSON.stringify(payload));
  return encrypted.split("/").join("@");
};

const decryptToken = function (token) {
  const encrypted = token.split("@").join("/");
  const decrypted = crypto.decrypt(encrypted);
  return JSON.parse(decrypted);
};

module.exports = {
  getBashScript: async function (userId, server) {
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

  getAgentInstallScript: async function (encryptedToken) {
    const token = decryptToken(encryptedToken);
    console.log("InstallScript, Token:", token);

    const filePath = path.join(__dirname, "../scripts/install.sh");
    let text = await readFile(filePath, "utf8");
    text = text
      .replace('LITEGIX_TOKEN=""', `LITEGIX_TOKEN=\"${encryptedToken}\"`)
      .replace('LITEGIX_URL=""', `LITEGIX_URL=\"${process.env.SERVER_URL}\"`);

    return text;
  },

  getInstallState: async function (server) {
    return {
      success: true,
      data: {
        state: "Install",
        percent: 20,
      },
    };
  },

  updateInstallState: async function (encryptedToken, data) {
    const { serverId } = decryptToken(encryptedToken);
    console.log("updateInstallState, Token:", serverId, data);

    const server = await Server.findById(serverId);
    if (!server) {
      return {
        success: false,
        errors: { message: "invalid_server_id" },
      };
    }

    let progress = 0;
    let message = data.message;
    if (data.status === "start") {
      progress = 5;
      message =
        "Starting installation. Upgrading system to latest update. This will take a while...";
    } else if (data.status === "port") {
      progress = 10;
      message = "Checking open port...";
    } else if (data.status === "config") {
      progress = 20;
      message = "Bootstrap server...";
    } else if (data.status === "update") {
      progress = 30;
      message = "Upgrating system to latest software version...";
    } else if (data.status === "packages") {
      progress = 35;
      message =
        "Installation started. Installing dependency will take a few minutes...";
    } else if (data.status === "supervisor") {
      progress = 70;
      message = "Configuring Supervisord to run background job...";
    } else if (data.status === "mariadb") {
      progress = 75;
      message = "Configuring MariaDB database...";
    } else if (data.status === "finish") {
      server.connected = true;
      progress = 100;
      message = "Server has been installed successufuly";
    }

    server.installation = {
      status: data.status,
      message: message,
      progress: progress,
    };
    await server.save();

    return {
      success: true,
    };
  },

  getInstallStatus: async function (server) {
    return {
      success: true,
      data: {
        ...server.installation,
      },
    };
  },
};
