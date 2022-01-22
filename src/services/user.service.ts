import { model } from 'mongoose'
import { User } from 'models'
const UserModel = model<User>('User')

export async function getUsers() {
  const users = await UserModel.find({})

  return {
    success: true,
    data: { users },
  }
}

export async function createUser({
  email,
  username,
  password,
}: {
  email: string
  username: string
  password: string
}) {
  const exists = await UserModel.findOne({ email })
  if (exists) {
    throw Error('Email is already token')
  }

  const user = new UserModel({
    username,
    email,
  })
  user.setPassword(password)

  const created = await user.save()

  return {
    success: true,
    data: { user: created },
  }
}

export async function deleteUser(userId: string) {
  const user = await UserModel.findById(userId)
  if (!user) {
    throw Error("User doesn't exists")
  }

  user.deleted = true
  await user.save()

  return {
    success: true,
    data: { id: user.id },
  }
}
