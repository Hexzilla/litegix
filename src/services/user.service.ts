import { model } from 'mongoose'
import { User } from 'models'
const UserModel = model<User>('User')

export async function getUsers() {
  const users = await UserModel.find({})

  return {
    success: true,
    data: {
      users,
    },
  }
}
