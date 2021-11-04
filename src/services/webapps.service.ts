import { randomBytes } from 'crypto'
import { model } from 'mongoose'
import { Server, Application, SystemUser } from 'models'
import * as activitySvc from 'services/activity.service'
import * as agentSvc from 'services/agent.service'
import {
  php_versions,
  web_application_stacks,
  web_environments,
  web_ssl_methods,
} from './constants'
const ApplicationModel = model<Application>('Application')
const SystemUserModel = model<SystemUser>('SystemUser')

const getDomainSuffix = function () {
  // const rs1 = randomBytes(5).toString('hex')
  // const rs2 = randomBytes(7).toString('hex')
  // return `${rs1}-${rs2}`
  return `kc${randomBytes(12).toString('hex')}`
}

export async function getWebApplications(server: Server) {
  const apps = await ApplicationModel.find({ server })
  return {
    success: true,
    data: {
      apps,
    },
  }
}

/**
 */
export async function createCustomWebApplication(server: Server) {
  const systemUsers = await SystemUserModel.find({ server })
  return {
    success: true,
    data: {
      system_users: systemUsers.map((user) => ({
        id: user.id,
        name: user.name,
      })),
      php_versions: php_versions,
      web_application_stacks: web_application_stacks,
      web_environments: web_environments,
      web_ssl_methods: web_ssl_methods,
      domainSuffix: getDomainSuffix(),
    },
  }
}

/**
 */
export async function storeCustomWebApplication(server: Server, payload: any) {
  const exists = await ApplicationModel.findOne({
    server: server,
    name: payload.name,
  })
  if (exists) {
    throw new Error('The name has already been taken.')
  }

  // check parameters
  const systemUser = await SystemUserModel.findById(payload.owner)
  if (!systemUser) {
    throw new Error('The user doen not exists.')
  }

  let domainName = payload.domainName
  if (payload.domainType == 'litegix') {
    domainName = `${payload.domainName}${payload.domainSuffix}`
  }
  const postData = {
    ...payload,
    domainName,
  }
  const res = await agentSvc.createWebApplication(server.address, postData)
  if (res.error != 0) {
    throw new Error(`Agent error ${res.error}`)
  }

  const data = {
    ...payload,
    domainName,
    webType: 'custom',
    server: server,
    systemUser: systemUser,
    publicPath: `/home/${systemUser.name}/webapps/${payload.suffixName}`,
  }
  /*const data = {
    server_user_id: payload.user,
    name: payload.name,
    rootPath: '/home/' + user.username + '/webapps/' + payload.name,
    publicPath:
      payload.publicPath == null
        ? '/home/' + user.username + '/webapps/' + payload.name
        : payload.publicPath,
    phpVersion: payload.phpVersion,
    stack: payload.stack,
    stackMode: payload.stackMode,
    type: 'custom',
    defaultApp: false,
    alias: null,
    pullKey1: 'jwMZwtXP3ItQRKKoMSZboAXr1561748870',
    pullKey2: 'zU4gYF96NZGjNqGSjUhasn0YZmlK2Ctu',
    advancedSSL: {
      advancedSSL: payload.ssl_tlsMethod == 'advanced',
      autoSSL: payload.autoSSL,
    },
    settings: {
      disableFunctions: payload.disableFunctions,
      timezone: payload.timezone,
      maxExecutionTime: payload.maxExecutionTime,
      maxInputTime: payload.maxExecutionTime,
      maxInputVars: payload.maxInputVars,
      memoryLimit: payload.memoryLimit,
      postMaxSize: payload.postMaxSize,
      uploadMaxFilesize: payload.uploadMaxFilesize,
      allowUrlFopen: payload.allowUrlFopen,
      sessionGcMaxlifetime: payload.sessionGcMaxlifetime,
      processManager: payload.processManager,
      processManagerStartServers: payload.processManagerStartServers,
      processManagerMinSpareServers: payload.processManagerMinSpareServers,
      processManagerMaxSpareServers: payload.processManagerMaxSpareServers,
      processManagerMaxChildren: payload.processManagerMaxChildren,
      processManagerMaxRequests: payload.processManagerMaxRequests,
      openBasedir: payload.openBasedir,
      clickjackingProtection: payload.clickjackingProtection,
      xssProtection: payload.xssProtection,
      mimeSniffingProtection: payload.mimeSniffingProtection,
    },
  }*/

  /*let domain_data = {
    name: payload.domain_name,
    type: 'primary',
    www: 'www_enable',
    dns_integration: payload.dns_integration,
    rediraction: payload.domain_rediraction,
  }*/

  const application = new ApplicationModel(data)
  await application.save()

  /**let domain = new Domains(domain_data)
  domain.applicationId = application.id
  await domain.save()*/

  const message = `Added new web application ${payload.name}`
  await activitySvc.createServerActivityLogInfo(server, message)

  return {
    success: true,
    data: { application },
  }
}

/**
 */
export async function createWordpressApplication(server: Server) {
  const systemUsers = await SystemUserModel.find({ server })
  return {
    success: true,
    data: {
      system_users: systemUsers.map((user) => ({
        id: user.id,
        name: user.name,
      })),
      php_versions: php_versions,
      web_application_stacks: web_application_stacks,
      web_ssl_methods: web_ssl_methods,
      domainSuffix: getDomainSuffix(),
      canvases: [],
    },
  }
}

/**
 */
export async function storeWordpressApplication(server: Server, payload: any) {
  const exists = await ApplicationModel.findOne({
    server: server,
    name: payload.name,
  })
  if (exists) {
    throw new Error('The name has already been taken.')
  }

  // check parameters
  const systemUser = await SystemUserModel.findById(payload.owner)
  if (!systemUser) {
    throw new Error('The user doen not exists.')
  }

  let domainName = payload.domainName
  if (payload.domainType == 'litegix') {
    domainName = `${payload.domainName}${payload.domainSuffix}`
  }
  const postData = {
    ...payload,
    domainName,
  }
  const res = await agentSvc.createWordpress(server.address, postData)
  if (res.error != 0) {
    throw new Error(`Agent error ${res.error}`)
  }

  const data = {
    ...payload,
    domainName,
    webType: 'wordpress',
    server: server,
    systemUser: systemUser,
  }

  const application = new ApplicationModel(data)
  await application.save()

  /**let domain = new Domains(domain_data)
  domain.applicationId = application.id
  await domain.save()*/

  const message = `Added new web application ${payload.name}`
  await activitySvc.createServerActivityLogInfo(server, message)

  return {
    success: true,
    data: { application },
  }
}

/**
 */
export async function createPhpMyAdmin(server: Server) {
  const systemUsers = await SystemUserModel.find({ server })
  return {
    success: true,
    data: {
      system_users: systemUsers.map((user) => ({
        id: user.id,
        name: user.name,
      })),
      php_versions: php_versions,
      web_application_stacks: web_application_stacks,
      web_ssl_methods: web_ssl_methods,
      domainSuffix: getDomainSuffix(),
    },
  }
}

/**
 */
export async function storePhpMyAdmin(server: Server, payload: any) {
  const exists = await ApplicationModel.findOne({
    server: server,
    name: payload.name,
  })
  if (exists) {
    throw new Error('The name has already been taken.')
  }

  // check parameters
  const systemUser = await SystemUserModel.findById(payload.owner)
  if (!systemUser) {
    throw new Error('The user doen not exists.')
  }

  let domainName = payload.domainName
  if (payload.domainType == 'litegix') {
    domainName = `${payload.domainName}${payload.domainSuffix}`
  }
  const postData = {
    ...payload,
    domainName,
  }
  const res = await agentSvc.createPhpMyAdmin(server.address, postData)
  if (res.error != 0) {
    throw new Error(`Agent error ${res.error}`)
  }

  const data = {
    ...payload,
    domainName,
    webType: 'phpmyadmin',
    server: server,
    systemUser: systemUser,
  }

  const application = new ApplicationModel(data)
  await application.save()

  /**let domain = new Domains(domain_data)
  domain.applicationId = application.id
  await domain.save()*/

  const message = `Added new web application ${payload.name}`
  await activitySvc.createServerActivityLogInfo(server, message)

  return {
    success: true,
    data: { application },
  }
}
