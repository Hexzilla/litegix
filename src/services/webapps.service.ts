import { randomBytes } from 'crypto'
import { v4 as uuidv4 } from 'uuid'
import { model } from 'mongoose'
import { Server, Webapp, SystemUser, Domain, DomainType } from 'models'
import * as activitySvc from 'services/activity.service'
import * as agentSvc from 'services/agent.service'
import {
  php_versions,
  web_application_stacks,
  web_environments,
  web_ssl_methods,
} from './constants'
const WebappModel = model<Webapp>('Webapp')
const DomainModel = model<Domain>('Domain')
const SystemUserModel = model<SystemUser>('SystemUser')

const getDomainSuffix = function () {
  return `kc${randomBytes(12).toString('hex')}`
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max)
}

export async function getWebApplications(server: Server) {
  const apps = await WebappModel.find({ server }).populate('owner')
  return {
    success: true,
    data: {
      apps: apps.map((it) => {
        return {
          ...it.toJSON(),
          owner: it.owner.name,
        }
      }),
    },
  }
}

export async function findWebappById(id: string) {
  const webapp = await WebappModel.findById(id)
  return {
    success: true,
    data: { webapp },
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
  const exists = await WebappModel.findOne({
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
    owner: systemUser,
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

  const webapp = new WebappModel(data)
  await webapp.save()

  /**let domain = new Domains(domain_data)
  domain.applicationId = application.id
  await domain.save()*/

  const message = `Added new web application ${payload.name}`
  await activitySvc.createServerActivityLogInfo(server, message)

  return {
    success: true,
    data: { application: webapp },
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
  const exists = await WebappModel.findOne({
    server: server,
    name: payload.name,
  })
  if (exists) {
    throw new Error('The name has already been taken.')
  }

  // check parameters
  let systemUser: SystemUser | null = null
  if (payload.useExistUser) {
    systemUser = await SystemUserModel.findById(payload.owner)
    if (!systemUser) {
      throw new Error('The user doen not exists.')
    }
  } else {
    systemUser = await SystemUserModel.findOne({ name: payload.owner })
    if (!systemUser) {
      systemUser = new SystemUserModel({
        name: payload.owner,
        password: 'litegix',
      })
      systemUser.server = server
      await systemUser.save()
    }
  }

  let domainName = payload.domainName
  if (payload.domainType == 'litegix') {
    domainName = `${payload.domainName}${payload.domainSuffix}`
  }

  const rand = function () {
    return 1000000 + getRandomInt(1000000)
  }

  const wp = payload.wordpress
  const wordpress = {
    ...wp,
    databaseUser: wp.databaseUser || `${payload.name}_${rand()}`,
    databasePass: wp.databasePass || `Litegix_${uuidv4().replace(/-/g, '')}`,
    databaseName: wp.databaseName || `${payload.name}_${rand()}`,
    siteTitle: wp.siteTitle || `${payload.name}_${rand()}`,
  }
  const postData = {
    name: payload.name,
    domainName,
    userName: systemUser?.name,
    phpVersion: payload.phpVersion,
    webserver: server.webserver,
    ...wordpress,
  }
  const res = await agentSvc.createWordpress(server.address, postData)
  if (res.error != 0) {
    throw new Error(`Agent error ${res.error}`)
  }

  const domainModel = new DomainModel({
    name: domainName,
    type: payload.domainType,
  })
  const domain = await domainModel.save()

  const webapp = new WebappModel({
    ...payload,
    domains: [domain],
    domainName,
    webType: 'wordpress',
    server: server,
    owner: systemUser,
  })
  await webapp.save()

  /**let domain = new Domains(domain_data)
  domain.applicationId = application.id
  await domain.save()*/

  const message = `Added new web application ${payload.name}`
  await activitySvc.createServerActivityLogInfo(server, message)

  return {
    success: true,
    data: { application: webapp },
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
  const exists = await WebappModel.findOne({
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

  const res = await agentSvc.createPhpMyAdmin(server.address, {
    ...payload,
    domainName,
  })
  if (res.error != 0) {
    throw new Error(`Agent error ${res.error}`)
  }

  const data = {
    ...payload,
    domainName,
    webType: 'phpmyadmin',
    server: server,
    owner: systemUser,
  }

  const webapp = new WebappModel(data)
  await webapp.save()

  /**let domain = new Domains(domain_data)
  domain.applicationId = application.id
  await domain.save()*/

  const message = `Added new web application ${payload.name}`
  await activitySvc.createServerActivityLogInfo(server, message)

  return {
    success: true,
    data: { application: webapp },
  }
}

/**
 */
export async function storeGitRepository(
  server: Server,
  webappId: string,
  payload: any
) {
  const webapp = await WebappModel.findById(webappId)
  if (!webapp) {
    throw new Error('The app does not exists.')
  }

  let githost = ''
  const provider = payload.provider
  if (provider == 'github') {
    githost = 'github.com'
  } else if (provider == 'gitlab') {
    githost = 'gitlab.com'
  } else if (provider == 'bitbucket') {
    githost = 'bitbucket.org'
  } else if (provider == 'custom') {
    if (!payload.githost) {
      throw new Error('Invalid Git Host.')
    }
    if (!payload.gituser) {
      throw new Error('Invalid Git User.')
    }
    githost = payload.githost
  }

  const url = `git@${githost}:${payload.repository}.git`
  const res = await agentSvc.createGitRepository(server.address, {
    url,
    branch: payload.branch,
  })
  if (res.error != 0) {
    throw new Error(`Agent error ${res.error}`)
  }

  webapp.git = {
    provider: payload.provider,
    githost: githost,
    repository: payload.repository,
    branch: payload.branch,
  }
  await webapp.save()

  const message = `Added git repository to web application ${webapp.name}`
  await activitySvc.createServerActivityLogInfo(server, message)

  return {
    success: true,
    data: { webappId: webappId },
  }
}

/**
 */
export async function getDomains(webappId: string) {
  const webapp = await WebappModel.findById(webappId).populate('domains')
  if (!webapp) {
    throw new Error('The app does not exists.')
  }

  return {
    success: true,
    data: {
      domains: webapp.domains,
    },
  }
}

/**
 */
export async function addDomain(webappId: string, data: Domain) {
  const webapp = await WebappModel.findById(webappId).populate('domains')
  if (!webapp) {
    throw new Error('The app does not exists.')
  }

  const exists = webapp.domains.find((it) => it.name == data.name)
  if (exists) {
    throw new Error('Name is already taken')
  }

  const domainModel = new DomainModel(data)
  domainModel.webapp = webapp
  const domain = await domainModel.save()

  webapp.domains.push(domain)
  await webapp.save()

  return {
    success: true,
    data: {
      domainId: domain.id,
    },
  }
}

/**
 */
export async function updateDomain(
  webappId: string,
  domainId: string,
  { type }: { type: DomainType }
) {
  const webapp = await WebappModel.findById(webappId).populate('domains')
  if (!webapp) {
    throw new Error('The app does not exists.')
  }

  const domain = webapp.domains.find((it) => it.id == domainId)
  if (!domain) {
    throw new Error("Domain doesn't exists")
  }

  domain.type = type
  await domain.save()

  return {
    success: true,
    data: {
      domainId: domain.id,
      type: type,
    },
  }
}

/**
 */
export async function deleteDomain(webappId: string, domainId: string) {
  const webapp = await WebappModel.findById(webappId).populate('domains')
  if (!webapp) {
    throw new Error('The app does not exists.')
  }

  const domain = webapp.domains.find((it) => it.id == domainId)
  if (!domain) {
    throw new Error('The domain does not exists')
  }

  const index = webapp.domains.indexOf(domain)
  if (index >= 0) {
    webapp.domains.splice(index, 1)
  }

  await domain.delete()

  return {
    success: true,
    data: {
      domainId: domain.id,
    },
  }
}

/**
 */
export async function getFileList(
  server: Server,
  webappId: string,
  folder: string
) {
  const webapp = await WebappModel.findById(webappId)
  if (!webapp) {
    throw new Error('The app does not exists.')
  }

  const res = await agentSvc.getFileList(server.address, webapp.name, folder)
  if (res.error != 0) {
    throw new Error(`Agent error ${res.error}`)
  }

  return {
    success: true,
    data: {
      files: res.files,
    },
  }
}

/**
 */
export async function createFile(
  server: Server,
  webappId: string,
  fileName: string
) {
  const webapp = await WebappModel.findById(webappId)
  if (!webapp) {
    throw new Error('The app does not exists.')
  }

  const res = await agentSvc.createFile(server.address, webapp.name, fileName)
  if (res.error != 0) {
    throw new Error(`Agent error ${res.error}`)
  }

  return {
    success: true,
  }
}

/**
 */
export async function createFolder(
  server: Server,
  webappId: string,
  fileName: string
) {
  const webapp = await WebappModel.findById(webappId)
  if (!webapp) {
    throw new Error('The app does not exists.')
  }

  const res = await agentSvc.createFolder(server.address, webapp.name, fileName)
  if (res.error != 0) {
    throw new Error(`Agent error ${res.error}`)
  }

  return {
    success: true,
  }
}

/**
 */
export async function changeFileName(
  server: Server,
  webappId: string,
  oldname: string,
  newname: string
) {
  const webapp = await WebappModel.findById(webappId)
  if (!webapp) {
    throw new Error('The app does not exists.')
  }

  const res = await agentSvc.changeFileName(
    server.address,
    webapp.name,
    oldname,
    newname
  )
  if (res.error != 0) {
    throw new Error(`Agent error ${res.error}`)
  }

  return {
    success: true,
  }
}

/**
 */
export async function changeFilePermission(
  server: Server,
  webappId: string,
  permission: string
) {
  const webapp = await WebappModel.findById(webappId)
  if (!webapp) {
    throw new Error('The app does not exists.')
  }

  const res = await agentSvc.changeFilePermission(
    server.address,
    webapp.name,
    permission
  )
  if (res.error != 0) {
    throw new Error(`Agent error ${res.error}`)
  }

  return {
    success: true,
  }
}

export async function getSummary(server: Server, webAppId: string) {
  const webapp = await WebappModel.findById(webAppId)
  if (!webapp) {
    throw new Error('The web application does not exists.')
  }

  return {
    success: true,
    data: {
      owner: 'aaaaaaa',
      totalDomainName: 1,
      phpVersion: 'php8.0',
      webAppStack: 'native_nginx',
      rootPath: '/home/litegix/webapps/app-boyle',
      publicPath: '/home/litegix/webapps/app-boyle',
      tdty: 16390,
      tdtm: 6390,
      dirSize: 6920301,
      sslMethod: 'Basic',
    },
  }
}

export async function storeWebSSL(
  server: Server,
  webAppId: string,
  payload: any
) {
  const webapp = await WebappModel.findById(webAppId)
  if (!webapp) {
    throw new Error('The web application does not exists.')
  }

  const postData = {
    domain: webapp.domainName,
    email: 'admin@litegix.com',
  }
  console.log('storeWebSSL, to agent', postData)
  const res = await agentSvc.createWebSSL(server.address, postData)
  if (res.error != 0) {
    throw new Error(`Agent error ${res.error}`)
  }

  //webapp.sslMode =
  //await webapp.save()

  const message = `Added new web application ${payload.name}`
  await activitySvc.createServerActivityLogInfo(server, message)

  return {
    success: true,
    data: { application: webapp },
  }
}
