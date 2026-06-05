export function formatDate(date: Date): string {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, "0")
  const dd = String(date.getDate()).padStart(2, "0")
  const hh = String(date.getHours()).padStart(2, "0")
  const min = String(date.getMinutes()).padStart(2, "0")

  return `${yyyy}/${mm}/${dd} ${hh}:${min}`
}

export function parseDate(str: string): { date: Date; err: boolean } {
  try {
    const normalized = str.trim().replace(/\s+/g, " ")
    const [datePart, timePart] = normalized.split(" ")
    const [yyyy, mm, dd] = datePart.split("/").map(Number)

    let hh = 23
    let min = 59

    if (timePart) {
      const parts = timePart.split(":").map(Number)
      hh = parts[0] ?? 23
      min = parts[1] ?? 59
    }

    const date = new Date(yyyy, mm - 1, dd, hh, min)
    const err = isNaN(date.getTime())

    return { date, err }
  } catch {
    return { date: new Date(), err: true }
  }
}
