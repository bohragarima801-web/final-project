import Razorpay from 'razorpay'

let _instance: Razorpay | null = null

export function getRazorpay(): Razorpay {
  if (_instance) return _instance
  const key_id = process.env.RAZORPAY_KEY_ID
  const key_secret = process.env.RAZORPAY_KEY_SECRET
  if (!key_id || !key_secret) {
    throw new Error('RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET are not configured')
  }
  _instance = new Razorpay({ key_id, key_secret })
  return _instance
}

export const RAZORPAY_PUBLIC_KEY_ID =
  process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || ''

export type PaymentIntentType = 'puja' | 'product' | 'donation' | 'chadhawa' | 'astro'

export type CreateOrderInput = {
  amountInRupees: number
  paymentType: PaymentIntentType
  referenceId?: string
  description?: string
  customer?: {
    name?: string
    email?: string
    contact?: string
  }
  notes?: Record<string, string | number | boolean>
}
