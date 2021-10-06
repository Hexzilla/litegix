const CryptoJS = require("crypto-js");

const SecretKey = "xJpNWjRRIqCc7rdxVdms01lcHzdrH6s9";

module.exports = {
  encrypt: (text) => {
    return CryptoJS.AES.encrypt(text, SecretKey).toString();
  },
  decrypt: (hash) => {
    return CryptoJS.AES.decrypt(hash, SecretKey).toString(CryptoJS.enc.Utf8);
  },
};
