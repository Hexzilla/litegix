import randomstring from 'randomstring'
import { model } from 'mongoose'
import { User, Server } from 'models'
const UserModel = model<User>('User')
const ServerModel = model<Server>('Server')

export async function getSummary(server: Server) {
  console.log('getSummary', server.address)
  server.system = {
    kernelVersion: '5.4.0-72-generic',
    processorName: 'Intel Xeon Processor (Skylake, IBRS)',
    totalCPUCore: 2,
    totalMemory: 3.750080108642578,
    freeMemory: 3.2643470764160156,
    diskTotal: 40.18845696,
    diskFree: 33.756172288,
    loadAvg: 16,
    uptime: '475h 50m 20s',
  }
  await server.save()

  return {
    success: true,
    data: server.toSummaryJSON(),
  }
}

// getting Server by url param serverId
export async function getServerInfo(server: Server) {
  return {
    success: true,
    data: server,
  }
}

export async function updateSetting(userId: string, server: Server) {
  /*//console.log(req.body); return;
  let otherCount = await ServerModel.count({
    $and: [{ _id: { $ne: req.payload.id } }, { name: req.body.name }],
  })
  if (otherCount > 0) {
    return res.status(423).json({
      success: false,
      errors: {
        name: ' has already been taken.',
      },
    })
  }

  myServer.name = req.body.name
  myServer.provider = req.body.provider
  await myServer.save()

  return {
    success: true,
    message: 'Server setting has been successfully updated.',
  }*/
}

export async function getServers(userId: string) {
  const user: any = userId
  const servers = await ServerModel.find({ user })
  return {
    success: true,
    data: {
      userId: userId,
      servers: servers.map((it) => {
        return {
          id: it._id,
          name: it.name,
          address: it.address,
          connected: it.connected,
          webserver: it.webserver,
          database: it.database,
        }
      }),
    },
  }
}

export async function storeServer(
  userId: string,
  data: {
    name: string
    address: string
    webserver: string
    database: string
    phpVersion: string
  }
) {
  const user = await UserModel.findById(userId)
  if (!user) {
    return {
      success: false,
      errors: { message: 'Invalid user' },
    }
  }

  const searchByAddress = await ServerModel.findOne({
    address: data.address,
  })
  if (searchByAddress) {
    return {
      success: false,
      errors: {
        message: 'Server address has already been taken.',
      },
    }
  }

  const searchByName = await ServerModel.findOne({
    name: data.name,
    userId: userId,
  })
  if (searchByName) {
    return {
      success: false,
      errors: {
        message: 'Server name has already been taken.',
      },
    }
  }

  const server = new ServerModel({
    ...data,
    connection: false,
    user: user,
    securityId: randomstring.generate(64),
    securityKey: randomstring.generate(84),
  })
  await server.save()

  return {
    success: true,
    data: { id: server.id },
  }
}

export async function deleteServer(server: Server) {
  await server.delete()

  return {
    success: true,
    data: { id: server._id },
  }
}

// export async function updateServerUsage(req: Request, res: Response) {
//   console.log('updateServerUsage', req.body)

//   const usage = new Usage(req.body)
//   usage.serverId = req.server.id
//   await usage.save()

//   res.json({
//     success: true,
//   })
// }

export async function getPhpVersion(server: Server) {
  return {
    success: true,
    data: {
      avaliable: ['7.2', '7.4', '8.0'],
      phpVersion: server.phpVersion,
    },
  }
}

export async function updatePhpVersion(server: Server, version: string) {
  server.phpVersion = version
  await server.save()

  return {
    success: true,
    data: {
      id: server._id,
      phpVersion: version,
    },
  }
}
