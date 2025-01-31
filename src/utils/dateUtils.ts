export const modeOptions = ['weekly', 'specific']
export const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
export const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

export function sortDates(config: string[]) {
  const order = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const sortedConfig = config.sort(
    (a, b) => order.indexOf(a) - order.indexOf(b),
  )
  return sortedConfig
}

export const convertDateToMonthDayYear = (date: Date) => {
  return `${
    months[date.getUTCMonth()]
  } ${date.getUTCDate()} ${date.getUTCFullYear()}`
}

export const convertDateStringToDateObject = (date: string) => {
  const dateParts = date.split(' ')
  const month = months.indexOf(dateParts[0])
  const day = parseInt(dateParts[1])
  const year = parseInt(dateParts[2])
  return new Date(year, month, day)
}

// compare dates, where date1 is the toString of a date object and date2 is a string in the format 'Month Day Year'
export const isSameDate = (date1: string, date2: string) => {
  const month = months[new Date(date1).getUTCMonth()]
  const dateDay = new Date(date1).getUTCDate()
  const year = new Date(date1).getUTCFullYear()
  return month + ' ' + dateDay + ' ' + year === date2
}

// format a date object string as 'Month Day'
export const formatDateMonthDay = (dateString: string): string => {
  if (dateString === '') {
    return 'Invalid Date'
  }
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// if date is in the format 'Month Day Year', return the date in the format of the toString of a date object
export const formattedDate = (date: string) => {
  return convertDateStringToDateObject(date).toString() !== 'Invalid Date'
    ? convertDateStringToDateObject(date).toString()
    : date
}

export const convertDateAndTimeToGoogleFormat = (
  dateString: string,
  time: string,
  mode: string,
): string => {
  // Parse the time into hour, minute, and period (AM/PM)
  const [hour, minute, period] = time.match(/(\d+):(\d+) (\w+)/)!.slice(1)

  // Adjust hours based on AM/PM
  let adjustedHour = parseInt(hour, 10)
  if (period === 'PM' && adjustedHour !== 12) {
    adjustedHour += 12
  } else if (period === 'AM' && adjustedHour === 12) {
    adjustedHour = 0
  }

  // Parse the input date
  const baseDate = mode === 'specific' ? new Date(dateString) : new Date()

  // Set the local time to the date object
  baseDate.setHours(adjustedHour, parseInt(minute, 10), 0, 0)

  baseDate.setHours(baseDate.getHours() + 1)

  // Create a UTC date using the local time
  const utcDate = new Date(baseDate.toISOString())

  // Format as Google Calendar date-time (YYYYMMDDTHHmmssZ)
  const utcYear = utcDate.getUTCFullYear()
  const utcMonth = String(utcDate.getUTCMonth() + 1).padStart(2, '0')
  const utcDay = String(utcDate.getUTCDate()).padStart(2, '0')
  const utcHours = String(utcDate.getUTCHours()).padStart(2, '0')
  const utcMinutes = String(utcDate.getUTCMinutes()).padStart(2, '0')
  const utcSeconds = '00'

  return `${utcYear}${utcMonth}${utcDay}T${utcHours}${utcMinutes}${utcSeconds}Z`
}
