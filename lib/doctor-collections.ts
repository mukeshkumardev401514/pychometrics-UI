export interface PaymentHistory {
  id: string; assignment_id: string; payment_event: string; amount: string | number | null
  currency: string; event_at: string; platform_payment_id: string | null; razorpay_payment_id: string | null
}
export function summarizeCollections(history: PaymentHistory[], now = new Date()) {
  const indiaDay = (date: Date) => new Date(date.getTime() + 330 * 60 * 1000).toISOString().slice(0, 10)
  const yesterdayDate = indiaDay(new Date(now.getTime() - 24 * 60 * 60 * 1000))
  const yesterday = new Map<string, number>()
  let yesterdayMissing = 0
  const seen = new Set<string>()
  const totals = new Map<string, number>()
  const months = new Map<string, Map<string, number>>()
  let missing = 0
  // Keep one successful event per payment; separate payment IDs remain separate collections.
  const successful = history.filter(p => p.payment_event === "PAYMENT_SUCCESSFUL")
    .sort((a, b) => Date.parse(a.event_at) - Date.parse(b.event_at) || a.id.localeCompare(b.id))
  for (const payment of successful) {
    const keys = [payment.platform_payment_id && `platform:${payment.platform_payment_id}`, payment.razorpay_payment_id && `gateway:${payment.razorpay_payment_id}`].filter(Boolean) as string[]
    if (!keys.length) keys.push(`event:${payment.id}`)
    const duplicate = keys.some(key => seen.has(key))
    keys.forEach(key => seen.add(key))
    if (duplicate) continue
    const amount = payment.amount == null ? NaN : Number(payment.amount)
    const cents = Math.round(amount * 100)
    const date = new Date(payment.event_at)
    const isYesterday = Number.isFinite(date.getTime()) && indiaDay(date) === yesterdayDate
    if (!Number.isSafeInteger(cents) || cents < 0 || !payment.currency || !Number.isFinite(date.getTime())) { missing++; if (isYesterday) yesterdayMissing++; continue }
    if (isYesterday) yesterday.set(payment.currency, (yesterday.get(payment.currency) || 0) + cents)
    const parts = new Intl.DateTimeFormat("en-GB", { year: "numeric", month: "2-digit", timeZone: "Asia/Kolkata" }).formatToParts(date)
    const month = `${parts.find(p => p.type === "year")!.value}-${parts.find(p => p.type === "month")!.value}`
    const bucket = months.get(month) || new Map<string, number>()
    bucket.set(payment.currency, (bucket.get(payment.currency) || 0) + cents)
    months.set(month, bucket)
    totals.set(payment.currency, (totals.get(payment.currency) || 0) + cents)
  }
  const amounts = (values: Map<string, number>) => [...values].map(([currency, cents]) => ({ currency, amount: cents / 100 }))
  return { yesterday: amounts(yesterday), yesterdayDate, yesterdayMissing, totals: amounts(totals), months: [...months].sort(([a], [b]) => b.localeCompare(a)).map(([month, values]) => ({ month, amounts: amounts(values) })), missing }
}
