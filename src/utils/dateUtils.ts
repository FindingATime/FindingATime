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
