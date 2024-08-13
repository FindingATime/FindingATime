'use client'

import { useEffect, useState } from 'react'
import { getAttendees, addAttendee } from '@/utils/attendeesUtils'
import { UUID } from 'crypto'

interface Attendee {
  users: { name: string }
  timesegments: { [key: string]: any[] }
}

export default function Test() {
  const [attendees, setAttendees] = useState<Attendee[]>([])

  useEffect(() => {
    // Use the utility function to fetch attendees
    console.log('Fetching attendees')
    getAttendees('3301bfc2-43f3-43cc-8e25-856eee164012').then((data) => {
      setAttendees(data)
    })
  }, [])

  return (
    <div>
      <h1>Attendees</h1>
      <ul>
        {attendees.map((attendee, index) => (
          <li key={index}>
            {attendee.users.name}
            <ul>
              {Object.entries(attendee.timesegments).map(
                ([date, segments], idx) => (
                  <li key={idx}>
                    {date}:{' '}
                    {segments.length > 0
                      ? segments.map((segment, i) => (
                          <span key={i}>{JSON.stringify(segment)}</span>
                        ))
                      : 'No segments'}
                  </li>
                ),
              )}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  )
}
