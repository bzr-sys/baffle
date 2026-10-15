/** Day 1 of the daily puzzle */
const FIRST_DAY = Date.UTC(2026, 9, 14)
const DAY_MS = 24 * 60 * 60 * 1000

/** Local date as YYYY-MM-DD */
export function today(offsetDays = 0): string {
  const d = new Date(Date.now() + offsetDays * DAY_MS)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** Daily puzzle number for a YYYY-MM-DD date, starting at 1 */
export function dailyNumber(date = today()): number {
  const [y, m, d] = date.split('-').map(Number)
  return Math.floor((Date.UTC(y!, m! - 1, d!) - FIRST_DAY) / DAY_MS) + 1
}

/** Place of a YYYY-MM-DD date in the yearly schedule: Jan 1 is 0, Dec 31 is 365 in leap years */
export function dayOfYear(date = today()): number {
  const [y, m, d] = date.split('-').map(Number)
  return Math.round((Date.UTC(y!, m! - 1, d!) - Date.UTC(y!, 0, 1)) / DAY_MS)
}

/** Days in a row solved, ending today or yesterday */
export function streak(solvedDates: Set<string>): number {
  let offset = solvedDates.has(today()) ? 0 : -1
  let days = 0
  while (solvedDates.has(today(offset))) {
    days++
    offset--
  }
  return days
}

export const longDate = (date = today()) =>
  new Date(date + 'T12:00:00').toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}
