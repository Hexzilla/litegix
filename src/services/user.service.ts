import { model } from 'mongoose'
import { User } from 'models'
const UserModel = model<User>('User')

export async function getUsers(page: number, size: number) {
  page = Math.max(0, isNaN(page) ? 1 : page)
  size = Math.min(100, isNaN(size) ? 10 : size)

  const users = await UserModel.find({})
    .skip((page - 1) * size)
    .limit(size)

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
