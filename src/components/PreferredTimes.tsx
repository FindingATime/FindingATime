import { useState, useEffect } from 'react'
import { Schedule } from '@/utils/attendeesUtils'
import { convertDateToMonthDayYear } from '@/utils/dateUtils'
import { times } from '@/utils/timeUtils'

interface PreferredTimesProps {
  attendeeTimeSegments: Schedule
  mode: string
}

export default function PreferredTimes({
  attendeeTimeSegments,
  mode,
}: PreferredTimesProps) {
  const [timesList, setTimesList] = useState<{ [date: string]: number }>({})

  useEffect(() => {
    const newTimesList: { [date: string]: number } = {}

    for (const timeSegments of Object.values(attendeeTimeSegments)) {
      for (const [date, segment] of Object.entries(timeSegments)) {
        for (const seg of Object.values(segment)) {
          const timeAndDate =
            mode === 'specific'
              ? convertDateToMonthDayYear(new Date(date)) +
                ' ' +
                seg.beginning +
                '-' +
                seg.end
              : date + ' ' + seg.beginning + '-' + seg.end // 'Month Day Year Beginning-End'
          if (seg.type === 'Preferred') {
            if (newTimesList[timeAndDate]) {
              newTimesList[timeAndDate] += 1
            } else {
              newTimesList[timeAndDate] = 1
            }
          }
        }
      }
    }

    setTimesList(newTimesList)
  }, [attendeeTimeSegments])

  const sortTimesList = Object.entries(timesList).sort((a, b) => {
    const [dateA, countA] = a
    const [dateB, countB] = b

    if (countA === countB) {
      const dateAParsed = new Date(dateA.split(' ')[0])
      const dateBParsed = new Date(dateB.split(' ')[0])
      return dateAParsed.getTime() - dateBParsed.getTime()
    }
    return countB - countA
  })

  return (
    <div className="mt-6">
      <h3 className="pb-3 text-sm font-medium text-gray-600">
        Preferred Times
      </h3>
      <ul className="text-xs text-gray-500">
        {sortTimesList.map(([timeAndDate, count], index) => {
          console.log('timesList in map', timesList)
          return (
            <li key={index} className="text-gray-500">
              {timeAndDate} [{count}]
            </li>
          )
        })}
      </ul>
    </div>
  )
}
