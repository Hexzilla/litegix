import { model } from 'mongoose'
import { PaymentMethod, PaymentHistory } from 'models'
const PaymentMethodModel = model<PaymentMethod>('PaymentMethod')
const PaymentHistoryModel = model<PaymentHistory>('PaymentHistory')

export async function getPaymentMethods(userId: string) {
  const user: any = userId
  const payments = await PaymentMethodModel.find({ user })

  return {
    success: true,
    data: { payments },
  }
}

export async function storePaymentMethods(userId: string, data: any) {
  const user: any = userId

  const paymentMethod = new PaymentMethodModel(data)
  paymentMethod.user = user
  await paymentMethod.save()

  return {
    success: true,
    data: { id: paymentMethod.id },
  }
}

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
