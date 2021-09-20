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
  return encrypted.split("/").join(".");
};

const decryptToken = function (token) {
  const encrypted = token.split(".").join("/");
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
    console.log("getScriptFile, Token:", token);

    const filePath = path.join(__dirname, "../scripts/install.sh");
    const text = await readFile(filePath, "utf8");
    return text;
  },
};
