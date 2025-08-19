const otpStore: Record<string, { otp: string; expires: number }> = {}

export function saveOtp(email: string, otp: string) {
  otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 } // valid 5 mins
}

export function verifyOtp(email: string, otp: string) {
  const record = otpStore[email]
  if (!record) return false
  if (Date.now() > record.expires) return false
  return record.otp === otp
}
