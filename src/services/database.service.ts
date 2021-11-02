import { model } from 'mongoose'
import { Server, Database, DatabaseUser } from 'models'
import * as activitySvc from 'services/activity.service'
import * as agentSvc from 'services/agent.service'
import { database_encodings } from './constants'
const DatabaseModel = model<Database>('Database')
const DatabaseUserModel = model<DatabaseUser>('DatabaseUser')

export async function getDatabases(server: Server) {
  const databases = await DatabaseModel.find({
    server,
  }).populate('users')
  return {
    success: true,
    data: { databases: databases.map((it) => it.toJSON()) },
  }
}

export async function createDatabase(server: Server) {
  const users = await DatabaseUserModel.find({ server })
  return {
    success: true,
    data: {
      db_users: users,
      database_encodings,
    },
  }
}

export async function storeDatabase(
  server: Server,
  data: { name: string; userId: string; collation: string }
) {
  const exists = await DatabaseModel.findOne({
    server,
    name: data.name,
  })
  if (exists) {
    throw Error('Database name has already been taken.')
  }

  const dbuser = await DatabaseUserModel.findById(data.userId)
  if (!dbuser) {
    throw Error('Invalid database user')
  }

  const payload = {
    name: data.name,
    encoding: data.collation,
  }
  const res = await agentSvc.createDatabase(server.address, payload)
  if (res.error != 0) {
    throw new Error(`Agent error ${res.error}`)
  }

  const model = {
    name: data.name,
    user: dbuser,
    server: server,
    collation: data.collation,
  }
  const database = new DatabaseModel(model)
  database.server = server
  await database.save()

  const message = `Added new database ${data.name} with collation ${data.collation}`
  await activitySvc.createServerActivityLogInfo(server, message, 1)

  return {
    success: true,
    data: { database },
  }
}

export async function deleteDatabase(server: Server, databaseId: string) {
  const database = await DatabaseModel.findById(databaseId)
  if (!database) {
    throw Error("It doesn't exists")
  }

  const res = await agentSvc.deleteDatabase(server.address, database.name)
  if (res.error != 0) {
    throw new Error(`Agent error ${res.error}`)
  }

  await database.remove()

  const message = `Deleted database ${database.name}`
  await activitySvc.createServerActivityLogInfo(server, message, 1)

  return {
    success: true,
    data: { id: databaseId },
  }
}

export async function getUngrantedDBuser(req: Request, res: Response) {
  /*try {
    let errors = valiator.validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() })
    }

    let server = req.server
    const database = await DatabaseModel.findById(req.params.databaseId)
    if (!database) {
      return res.status(422).json({
        success: false,
        errors: { message: "Database doesn't exists" }
      })
    }

    const ungrantedusers = await DatabaseUserModel.find({
      _id: { $nin: database.users }
    })

    return res.json({
      success: true,
      data: { ungrantedusers }
    })
  } catch (e) {
    console.error(e)
    return res.status(501).json({ success: false })
  }*/
}

export async function grantDBuser(req: Request, res: Response) {
  /*try {
    let errors = valiator.validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() })
    }

    const database = await DatabaseModel.findById(req.params.databaseId)
    if (!database) {
      return res.status(422).json({
        success: false,
        errors: { message: "Database doesn't exists" }
      })
    }

    const dbuser = await DatabaseUserModel.findById(req.body.dbuserId)
    if (!dbuser) {
      return res.status(422).json({
        success: false,
        errors: { message: "user doesn't exists" }
      })
    }

    if (database.users.includes(req.body.dbuserId)) {
      return res.status(422).json({
        success: false,
        errors: { message: 'user already granted in database' }
      })
    }

    database.users.push(req.body.dbuserId)
    await database.save()

    return res.json({
      success: true,
      message: 'It has been successfully granted.',
    })
  } catch (e) {
    console.error(e)
    return res.status(501).json({ success: false })
  }*/
}

export async function revokeDBuser(req: Request, res: Response) {
  /*try {
    let errors = valiator.validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() })
    }

    const database = await DatabaseModel.findById(req.params.databaseId)
    if (!database) {
      return res.status(422).json({
        success: false,
        errors: { message: "Database doesn't exists" }
      })
    }

    const dbuser = await DatabaseUserModel.findById(req.params.dbuserId)
    if (!dbuser) {
      return res.status(422).json({
        success: false,
        errors: { message: "user doesn't exists" }
      })
    }

    let gIndex = database.users.indexOf(req.params.dbuserId)
    if (gIndex < 0) {
      return res.status(422).json({
        success: false,
        errors: { message: 'user not granted in database' }
      })
    }

    database.users.splice(gIndex, 1)
    await database.save()

    return res.json({
      success: true,
      message: 'It has been successfully granted.',
    })
  } catch (e) {
    console.error(e)
    return res.status(501).json({ success: false })
  }*/
}

export async function getDatabaseUser(databaseUserId: string) {
  const databaseUser = await DatabaseUserModel.findById(databaseUserId)
  if (!databaseUser) {
    return {
      success: false,
      errors: { message: "User doesn't exists" },
    }
  }
  return {
    success: true,
    data: { dbuser: databaseUser },
  }
}

export async function getDatabaseUserList(server: Server) {
  const users = await DatabaseUserModel.find({ server })
  return {
    success: true,
    data: { dbusers: users },
  }
}

export async function createDatabaseUser(req: Request, res: Response) {
  /*return res.json({
    success: true,
    data: {}
  })*/
}

export async function storeDatabaseUser(
  server: Server,
  data: { name: string }
) {
  const exists = await DatabaseUserModel.findOne({
    server,
    name: data.name,
  })
  if (exists) {
    throw Error('Database User name has already been taken.')
  }

  /*const result = await agentSvc.createDatabaseUser(server.address, data)
  if (!result.success) {
    throw Error(result.message)
  }*/

  const databaseUser = new DatabaseUserModel(data)
  databaseUser.server = server
  await databaseUser.save()

  const message = `Added new database user ${data.name} with password`
  await activitySvc.createServerActivityLogInfo(server, message)

  return {
    success: true,
    message: 'It has been successfully created.',
  }
}

export async function deleteDatabaseUser(server: Server, dbuserId: string) {
  const user = await DatabaseUserModel.findById(dbuserId)
  if (!user) {
    throw Error("It doesn't exists")
  }

  /*const result = await agentSvc.deleteDatabaseUser(server.address, user.name)
  if (!result.success) {
    throw Error(result.message)
  }*/

  await user.remove()

  const message = `Deleted database user ${user.name}`
  await activitySvc.createServerActivityLogInfo(server, message)

  return {
    success: true,
    data: { id: dbuserId, name: user.name },
  }
}

export async function changePassword(
  server: Server,
  dbuserId: string,
  password: string
) {
  const user = await DatabaseUserModel.findById(dbuserId)
  if (!user) {
    throw Error("It doesn't exists")
  }

  /*const result = await agentSvc.deleteDatabaseUser(server.address, user.name)
  if (!result.success) {
    throw Error(result.message)
  }*/

  user.password = password
  await user.save()

  const message = `Changed database user password ${user.name}`
  await activitySvc.createServerActivityLogInfo(server, message)

  return {
    success: true,
    data: { id: dbuserId, name: user.name },
  }
}
