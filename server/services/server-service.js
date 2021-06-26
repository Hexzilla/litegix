const path = require('path')
const fs = require('fs')
const util = require('util')
const readFile = util.promisify(fs.readFile);
const valiator = require('express-validator')
const mongoose = require("mongoose")
const Server = mongoose.model("Server")
const crypto = require('./crypto-service')

const defaultScript = "export DEBIAN_FRONTEND=noninteractive; echo 'Acquire::ForceIPv4 \"true\";' | tee /etc/apt/apt.conf.d/99force-ipv4; apt-get update; apt-get install curl netcat-openbsd -y; curl -4 --silent --location http://localhost:3000/servers/script/USER_INFO | bash -; export DEBIAN_FRONTEND=newt"

const getServers = function (req, res, next) {
  Server.find({user: req.payload.id})
    .then(servers => {
      console.log(servers)
      res.json({
        success: true, 
        servers: servers
      })
    })
    .catch(next)
}

const create = function (req, res, next) {
  const errors = valiator.validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const server = new Server(req.body)
  server.connected = false
  server.user = req.payload.id
  server.save()

  res.json({
    success: true,
    message: "Your server has been successfully created."
  })
}

const getShellCommand = function(req, res) {
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
    data: {
      script: script
    }
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
  getServers,
  create,
  getScript,
  getShellCommand
}
