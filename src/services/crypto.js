const CryptoJS = require('crypto-js')

const SecretKey = 'xJpNWjRRIqCc7rdxVdms01lcHzdrH6s9'

export default {
  encrypt: (text) => {
    return CryptoJS.AES.encrypt(text, SecretKey).toString()
  },
  decrypt: (hash) => {
    return CryptoJS.AES.decrypt(hash, SecretKey).toString(CryptoJS.enc.Utf8)
  },
}
