import { model } from 'mongoose'
import { PaymentHistory } from 'models'
const PaymentHistoryModel = model<PaymentHistory>('PaymentHistory')

export async function getPaymentHistory(userId: string) {
  const user: any = userId
  const histories = await PaymentHistoryModel.find({ user })

  return {
    success: true,
    data: { histories },
  }
}

export async function storePaymentHistory(
  userId: string,
  {
    type,
    amount,
    date,
    invoice,
    receipt,
  }: {
    type: string
    amount: number
    date: string
    invoice: string
    receipt: string
  }
) {
  const user: any = userId
  const paymentHistory = new PaymentHistoryModel({
    user,
    amount,
    type,
    date,
    invoice,
    receipt,
  })
  await paymentHistory.save()

  return {
    success: true,
    data: { paymentHistory },
  }
}
