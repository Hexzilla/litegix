const path = require('path')
const fs = require('fs')
const util = require('util')
const readFile = util.promisify(fs.readFile);
const { validationResult } = require('express-validator')
const crypto = require('./crypto-service')

const defaultScript = "export DEBIAN_FRONTEND=noninteractive; echo 'Acquire::ForceIPv4 \"true\";' | tee /etc/apt/apt.conf.d/99force-ipv4; apt-get update; apt-get install curl netcat-openbsd -y; curl -4 --silent --location http://localhost:3000/servers/script/USER_INFO | bash -; export DEBIAN_FRONTEND=newt"

const create = function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  //const token = req.headers.authorization.split(' ')[1]
  const token = {
    userId: req.payload.id,
    address: req.body.address,
    token: '',
  }
  const encrypted = crypto.encrypt(JSON.stringify(token))
  const scriptId = encrypted.split('/').join('.')
  const script = defaultScript.replace('USER_INFO', scriptId)
  console.log('script', script)
  
  res.json({
    success: true,
    script: script
  })
}

const getToken = function(token) {
  const encrypted = token.split('.').join('/')
  const decrypted = crypto.decrypt(encrypted)
  return JSON.parse(decrypted)
}

const getScript = async function (req, res, next) {
  const token = getToken(req.params.token)

  const filePath = path.join(__dirname, '../scripts/install.sh')
  readFile(filePath, 'utf8')
    .then(text => {
      console.log(text)
      res.send(text)
    })
    .catch(err => {
      return res.status(422).json({ errors: "Can't read file" })
    })
}

module.exports = {
  create,
  getScript,
}
