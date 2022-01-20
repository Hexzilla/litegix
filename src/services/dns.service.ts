import { model } from 'mongoose'
import { DNS } from 'models'
const DNSModel = model<DNS>('DNS')

export async function getDomainRecords(userId: string) {
  const user: any = userId
  const records = await DNSModel.find({ user })

  return {
    success: true,
    data: { records },
  }
}

export async function storeDomainRecord(userId: string, data: any) {
  const user: any = userId

  const dns = new DNSModel(data)
  dns.user = user
  await dns.save()

  return {
    success: true,
    data: { id: dns.id },
  }
}
