const CryptoJS = require("crypto-js");

const SecretKey = 'xJpNWjRRIqCc7rdxVdms01lcHzdrH6s9';

const encrypt = (text) => {
  return CryptoJS.AES.encrypt(text, SecretKey).toString();
};

const decrypt = (hash) => {
  return CryptoJS.AES.decrypt(hash, SecretKey).toString(CryptoJS.enc.Utf8);
};

module.exports = {
    encrypt,
    decrypt
};