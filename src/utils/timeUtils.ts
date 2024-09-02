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
  //console.log generateTimeRange); // debug prints array

  return generateTimeRange
}
