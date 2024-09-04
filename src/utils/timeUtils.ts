// Generate hourly time options array used for EarliestTime and LatestTime dropdowns
export const times: string[] = []
for (let hour = 0; hour < 24; hour++) {
  const suffix = hour < 12 ? 'AM' : 'PM'
  const displayHour = hour % 12 === 0 ? 12 : hour % 12
  times.push(`${displayHour}:00 ${suffix}`)
  times.push(`${displayHour}:30 ${suffix}`)
}

// Function to populate an array with times from earliest to latest used in rows for availability grid
export const generateTimeRange = (
  earliest: string,
  latest: string,
): string[] => {
  const timeToIndex = (time: string): number => times.indexOf(time)

  // Convert earliest and latest times to their corresponding indices
  let start = timeToIndex(earliest)
  let end = timeToIndex(latest)

  // Handle case where latest time is earlier in the day than the earliest time
  if (end <= start) {
    end += 24
  }

  // Populate the generateTimeRange array with times from start to end
  const generateTimeRange: string[] = []
  for (let i = start; i <= end + 1; i++) {
    generateTimeRange.push(times[i % 24])
  }

  return generateTimeRange
}

const timeZones = [
  { value: 'PST', label: 'UTC−08:00 PST (Pacific Standard Time)' },
  { value: 'MST', label: 'UTC−07:00 MST (Mountain Standard Time)' },
  { value: 'CST', label: 'UTC−06:00 CST (Central Standard Time)' },
  { value: 'EST', label: 'UTC−05:00 Eastern Standard Time' },
  { value: 'AKST', label: 'UTC−09:00 AKST (Alaska Standard Time)' },
  { value: 'HST', label: 'UTC−10:00 HST (Hawaii-Aleutian Standard Time)' },
  { value: 'GMT', label: 'UTC−00:00 GMT (Greenwich Mean Time)' },
  { value: 'CET', label: 'UTC+01:00 CET (Central European Time)' },
  { value: 'EET', label: 'UTC+02:00 EET (Eastern European Time)' },
  { value: 'CST', label: 'UTC+08:00 CST (China Standard Time)' },
  { value: 'AST', label: 'UTC−04:00 AST (Atlantic Standard Time)' },
  { value: 'IST', label: 'UTC+05:30 IST (Indian Standard Time)' },
  { value: 'JST', label: 'UTC+09:00 JST (Japan Standard Time)' },
  { value: 'AEST', label: 'UTC+10:00 AEST (Australian Eastern Standard Time)' },
]

// Sorts time zones by UTC time, from negative to positive
export const sortedTimeZones = timeZones.sort((a, b) => {
  const getUTCOffset = (label: any) => {
    const match = label.match(/UTC([−+])(\d{2}):(\d{2})/)
    if (!match) return 0

    const sign = match[1] === '−' ? -1 : 1
    const hours = parseInt(match[2], 10)
    const minutes = parseInt(match[3], 10)

    return sign * (hours + minutes / 60)
  }

  return getUTCOffset(a.label) - getUTCOffset(b.label)
})
