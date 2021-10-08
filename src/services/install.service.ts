import path from 'path'
import fs from 'fs'
import util from 'util'
import { model } from 'mongoose'
import { Server } from 'models'
import config from './config.service'
import crypto from './crypto.service'
const ServerModel = model<Server>('Server')
const readFile = util.promisify(fs.readFile)

const encryptToken = (payload: any) => {
  const encrypted = crypto.encrypt(JSON.stringify(payload))
  return encrypted.split('/').join('@')
}

const decryptToken = function (token: string) {
  const encrypted = token.split('@').join('/')
  const decrypted = crypto.decrypt(encrypted)
  return JSON.parse(decrypted)
}

export async function getBashScript(userId: string, server: Server) {
  const payload = {
    userId,
    serverId: server.id,
  }
  const token = encryptToken(payload)
  return {
    success: true,
    data: {
      name: server.name,
      loginScript: 'ssh root@' + server.address,
      installScript: config.install_script(token),
    },
  }
}

export async function getAgentInstallScript(encryptedToken: string) {
  const token = decryptToken(encryptedToken)
  console.log('InstallScript, Token:', token)

  const server = await ServerModel.findById(token.serverId)
  if (!server) {
    throw Error('Invalid Token')
  }

  const filePath = path.join(__dirname, '../../scripts/install.sh')
  const text = await readFile(filePath, 'utf8')
  return text
    .replace('LITEGIX_TOKEN=""', `LITEGIX_TOKEN=\"${encryptedToken}\"`)
    .replace('LITEGIX_URL=""', `LITEGIX_URL=\"${process.env.SERVER_URL}\"`)
    .replace('SERVERID=""', `SERVERID=\"${server.securityId}\"`)
    .replace('SERVERKEY=""', `SERVERKEY=\"${server.securityKey}\"`)
    .replace('WEBSERVER=""', `WEBSERVER=\"${server.webserver}\"`)
    .replace('DATABASE=""', `DATABASE=\"${server.database}\"`)
}

export async function getInstallState(server: Server) {
  return {
    success: true,
    data: {
      state: 'Install',
      percent: 20,
    },
  }
}

export async function updateInstallState(encryptedToken: string, data: any) {
  const { serverId } = decryptToken(encryptedToken)
  console.log('updateInstallState, Token:', serverId, data)

  const server = await ServerModel.findById(serverId)
  if (!server) {
    return {
      success: false,
      errors: { message: 'invalid_server_id' },
    }
  }
  console.log('updateInstallState, found server')

  let progress = server.installation?.progress || 0
  let message = data.message
  if (data.status === 'start') {
    progress = 5
    message =
      'Starting installation. Upgrading system to latest update. This will take a while...'
  } else if (data.status === 'port') {
    progress = 10
    message = 'Checking open port...'
  } else if (data.status === 'config') {
    progress = 20
    message = 'Bootstrap server...'
  } else if (data.status === 'update') {
    progress = 30
    message = 'Upgrating system to latest software version...'
  } else if (data.status === 'packages') {
    progress = 35
    message =
      'Installation started. Installing dependency will take a few minutes...'
  } else if (data.status === 'supervisor') {
    progress = 70
    message = 'Configuring Supervisord to run background job...'
  } else if (data.status === 'mariadb') {
    progress = 75
    message = 'Configuring MariaDB database...'
  } else if (data.status === 'finish') {
    server.connected = true
    progress = 100
    message = 'Server has been installed successufuly'
  }

  server.installation = {
    status: data.status,
    message: message,
    progress: progress,
  }
  await server.save()

  return {
    success: true,
  }
}

export async function getInstallStatus(server: Server) {
  return {
    success: true,
    data: {
      ...server.installation,
    },
  }
}
